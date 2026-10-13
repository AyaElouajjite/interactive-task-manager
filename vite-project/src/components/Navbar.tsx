import { MdOutlineSearch } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import { setSearchTerm } from "../redux/slices/searchSlice"; // Import de l'action
import UserAvatar from "./UserAvatar";
import NotificationPanel from "./NotificationPanel";
import { useEffect, useState, useContext } from "react";
import { ThemeContext } from "../App";
//import ReactSwitch from "react-switch";
const Navbar = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    return null;
  }
  const { theme, toggleTheme } = themeContext;

  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleSidebar = () => {
    dispatch(setOpenSidebar(true));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value)); // Met à jour Redux avec la recherche
  };

  return (
    <div className="flex justify-between items-center bg-white px-4 py-3 2xl:py-4 sticky z-10 top-0 transition-colors duration-500">
      <div className="flex gap-4">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-gray-500 block md:hidden"
        >
          ☰
        </button>

        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full  bg">
          {/* bg-[#f3f4f6] */}
          <MdOutlineSearch className="text-gray-500 text-xl" />

          <input
            type="text"
            placeholder="Search..."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
            onChange={handleSearchChange} // Capture la recherche
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <button
          className="p-2 dark:bg-gray-700 text-gray-800 dark:text-yellow-400"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {/* <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} /> */}
        {/* <NotificationPanel /> */}
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
