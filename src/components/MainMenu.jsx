import React from 'react';

function MainMenu({ onStart }) {
  return (
    <div className="main-menu">
      <h1 className="menu-title">SKIRT OFF</h1>
      <button className="start-button" onClick={onStart}>
        Старт
      </button>
    </div>
  );
}

export default MainMenu;
