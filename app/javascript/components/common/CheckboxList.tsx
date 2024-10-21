import * as React from "react";

interface Item {
  id: string;
  [key: string]: any; 
}

interface Props {
  items: Item[]; 
  checkedItems: string[]; 
  setCheckedItems: Function;
  labelField?: string;
}

const CheckboxList: React.FC<Props> = ({
  items,
  checkedItems,
  setCheckedItems,
  labelField
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const numberToShow = 6;
  const itemsToShow = showAll ? items : items.slice(0, numberToShow);

  const handleCheckboxChange = (itemId: string, checked: boolean) => {

    setCheckedItems((prevCheckedItems) => {
      if (checked) {
        if (!prevCheckedItems.includes(itemId)) {
          const updatedItems = [...prevCheckedItems, itemId];
          return updatedItems;
        }
      } else {
        const updatedItems = prevCheckedItems.filter((id) => id !== itemId);
        return updatedItems;
      }
      return prevCheckedItems;
    });
  };


  return (
    <div className="multiple-checkbox">
      {itemsToShow.map((item) => (
        <div key={item.id} className="checkbox-row-container">
          <label className="option-text">
            <input
              type="checkbox"
              name={item.id} 
              onChange={(e) =>
                handleCheckboxChange(item.id, e.target.checked)
              }
              checked={checkedItems.includes(item.id)} 
              className="checkbox"
            />
            {item[labelField]} 
          </label>
        </div>
      ))}
      {items.length > numberToShow && (
        <button onClick={() => setShowAll(!showAll)} className="view-all">
          {showAll ? "Show Less..." : "View All..."}
        </button>
      )}
    </div>
  );
};

export default CheckboxList;
