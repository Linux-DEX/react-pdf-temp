import React, { useState, useEffect, useRef } from 'react';

const ContextMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);

  const handleRightClick = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
  };

  const handleClick = () => {
    setMenuVisible(false);
  };

  const handleCopy = () => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
        .then(() => {
          alert('Text copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      alert('No text selected!');
    }
    setMenuVisible(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleRightClick);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
    <>
      {menuVisible && (
        <div
          ref={menuRef}
          className="context-menu"
          style={{
            display: 'block',
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
          }}
        >
          <ul>
            <li><a href="#">Edit</a></li>
            <li><a onClick={handleCopy}>Copy</a></li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .context-menu {
          position: absolute;
          text-align: center;
          background: #1f2335;
          border-radius: 7px;
        }

        .context-menu ul {
          padding: 0px;
          margin: 0px;
          min-width: 150px;
          list-style: none;
        }

        .context-menu ul li {
          padding-bottom: 7px;
          padding-top: 7px;
          border: 1px solid black;
        }

        .context-menu ul li a,
        .context-menu ul li button {
          text-decoration: none;
          color: white;
        }

        .context-menu ul li:hover {
          background: #3b4261;
        }
      `}</style>
    </>
  );
};

export default ContextMenu;

