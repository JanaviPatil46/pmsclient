import * as React from 'react';
import PropTypes from 'prop-types';

const products = [
  {
    name: 'Professional plan',
    desc: 'Monthly subscription',
    price: '$15.00',
  },
  {
    name: 'Dedicated support',
    desc: 'Included in the Professional plan',
    price: 'Free',
  },
  {
    name: 'Hardware',
    desc: 'Devices needed for development',
    price: '$69.99',
  },
  {
    name: 'Landing page template',
    desc: 'License',
    price: '$49.99',
  },
];

function Info({ totalPrice }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total</p>
      <p className="text-3xl font-bold text-foreground">{totalPrice}</p>
      <div className="divide-y divide-border">
        {products.map((product) => (
          <div key={product.name} className="flex items-center justify-between py-3">
            <div className="mr-4">
              <p className="text-sm font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.desc}</p>
            </div>
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">{product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Info.propTypes = {
  totalPrice: PropTypes.string.isRequired,
};

export default Info;