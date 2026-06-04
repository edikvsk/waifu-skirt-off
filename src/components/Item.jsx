import React, { forwardRef } from 'react';

const Item = forwardRef(({ currentLevel }, ref) => {
  const getItemImage = () => {
    switch (currentLevel) {
      case 2:
        return '/item_2.png';
      case 3:
        return '/item_3.png';
      case 4:
        return '/item_4.png';
      default:
        return '/item_1.png';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: '270px',
        left: '400px',
        width: currentLevel === 4 ? '150px' : '300px',
        height: currentLevel === 4 ? '150px' : '300px',
        backgroundImage: `url(${getItemImage()})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        zIndex: 3,
        opacity: 0,
        pointerEvents: 'none',
        transform: currentLevel === 4 ? 'translateY(-67.5px)' : 'translateY(-135px)'
      }}
    />
  );
});

Item.displayName = 'Item';

export default Item;
