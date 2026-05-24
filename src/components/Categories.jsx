import "../styles/categories.css";

function Categories({
  activeCategory,
  setActiveCategory
}) {

  const categories = [
    "Semua",
    "Populer",
    "Makanan",
    "Minuman",
    "Dessert",
    "Cemilan"
  ];

  return (

    <div className="categories">

      {categories.map((item) => (

        <span
          key={item}
          className={
            activeCategory === item
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveCategory(item)
          }
        >
          {item}
        </span>

      ))}

    </div>
  );
}

export default Categories;