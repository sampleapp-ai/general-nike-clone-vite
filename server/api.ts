import type { IncomingMessage, ServerResponse } from 'http';
import Stripe from 'stripe';

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(secretKey, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
  });
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function handleCreateCheckoutSession(req: IncomingMessage, res: ServerResponse) {
  try {
    const { items, total, subtotal, tax, uiMode } = await readBody(req);

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'No items provided' }));
      return;
    }

    const stripe = getStripe();

    const lineItems = items.map(
      (item: {
        name: string;
        subtitle: string;
        color: string;
        size: string;
        price: number;
        quantity: number;
        image: string;
      }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `${item.subtitle} - ${item.color || 'N/A'} - Size: ${item.size}`,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    const origin = req.headers.origin || 'http://localhost:5173';

    if (uiMode === 'hosted') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?canceled=true`,
        metadata: {
          subtotal: subtotal.toFixed(2),
          tax: tax.toFixed(2),
          total: total.toFixed(2),
        },
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }));
      return;
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'custom',
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      clientSecret: session.client_secret,
      sessionId: session.id,
    }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create checkout session';
    res.end(JSON.stringify({ error: errorMessage }));
  }
}

async function handleSessionStatus(req: IncomingMessage, res: ServerResponse) {
  try {
    const { session_id } = await readBody(req);

    if (!session_id) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'session_id is required' }));
      return;
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent'],
    });

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: session.status,
      payment_status: session.payment_status,
      payment_intent_id: paymentIntent?.id || null,
      payment_intent_status: paymentIntent?.status || null,
    }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to retrieve session status';
    res.end(JSON.stringify({ error: errorMessage }));
  }
}

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (req.url === '/api/create-checkout-session') {
    await handleCreateCheckoutSession(req, res);
  } else if (req.url === '/api/session-status') {
    await handleSessionStatus(req, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
}
