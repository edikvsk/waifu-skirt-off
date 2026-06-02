import React, { forwardRef } from 'react';

const Item = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '370px',
        left: '0',
        width: '300px',
        height: '300px',
        backgroundImage: 'url(/item_1.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 3,
        opacity: 0,
        pointerEvents: 'none',
        transform: 'translateY(-135px)'
      }}
    />
  );
});

Item.displayName = 'Item';

export default Item;
