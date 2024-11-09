import { React, useState } from 'react';

export const NewMenu = ({
    menuLabel,
    items,
  }) => {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <div>
      <button
        type='button'
        onClick={handleToggle}
      >
        {menuLabel}
      </button>
      {open && (
        <div>
          <ul
            role='menu'
          >
            {items.map((item, index) => (
              <li 
                role='menu item'
                key={index}
              >
                {item.url ? (
                  <link
                    to={item.url}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </link>
                ) : (
                  <button
                    type='button'
                    onClick={() => {
                      item.action?.();
                      setOpen(false);
                    }}
                  >
                    {item.title}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}