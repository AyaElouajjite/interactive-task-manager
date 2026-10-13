import { Transition } from "@headlessui/react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Task from "./pages/task";
import Trash from "./pages/trash";
import Taskdetails from "./pages/taskDetails";
import Login from "./pages/login";
import { Toaster } from "sonner";
import { RootState } from "./redux/store";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import NavSidebar from "./components/Navbar";
import { createContext, useState, Fragment, useRef, useEffect } from "react";
import { setOpenSidebar } from "./redux/slices/authSlice";
import { IoClose } from "react-icons/io5";
import clsx from "clsx";
import ResetPassword from "./pages/ResetPassword";
import TaskSorted from "./pages/tasks_sorted";

function Layout() {
  const { user } = useSelector((state: RootState) => state.auth);
  // Permet d'obtenir l'URL actuelle et ses informations dans une application React utilisant
  const location = useLocation();
  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row ">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block transition-colors duration-500">
        <Sidebar />
      </div>

      <MobileSidebar />
      <div className="flex-1 overflow-y-auto">
        <NavSidebar />
        <div className="p-4 2xl:px-10">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  ) : (
    /*Redirige l'utilisateur vers login. Stocke l'URL actuelle (location) dans state,
     afin qu’on puisse le récupérer après la connexion.*/
    /*
     Avec replace : L'utilisateur ne pourra pas revenir à la page précédente avec le bouton "retour" du navigateur après la redirection.
b    Sans replace : La page actuelle est conservée dans l'historique, donc l'utilisateur peut revenir en arrière.
     */
    <Navigate to="/login" state={{ from: location }} replace></Navigate>
  );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state: RootState) => state.auth);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null); // Spécifie le type pour le ref
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter="transition-opacity duration-700"
        enterFrom="opacity-x-10"
        enterTo="opacity-x-100"
        leave="transition-opacity duration-700"
        leaveFrom="opacity-x-100"
        leaveTo="opacity-x-0"
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className="bg-white w-3/4 h-full">
              <div className="w-full flex justify-end px-5 pt-6">
                <button
                  onClick={() => closeSidebar()}
                  className="flex justify-end items-end"
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className="-mt-10">
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

// Define the context type
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
export const ThemeContext = createContext<ThemeContextType | null>(null);

function App() {
  const [theme, setTheme] = useState<string>(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <main
        className="w-full min-h-screen transition-colors duration-500"
        id={theme}
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/tasks" element={<Task />}></Route>
            <Route path="/completed/:status" element={<Task />}></Route>
            <Route path="/in_progress/:status" element={<Task />}></Route>
            <Route path="/todo/:status" element={<Task />}></Route>
            <Route path="/high/:priority" element={<Task />}></Route>
            <Route path="/medium/:priority" element={<Task />}></Route>
            <Route path="/low/:priority" element={<Task />}></Route>
            <Route path="/sorted_due_date" element={<TaskSorted />}></Route>
            <Route path="/trashed" element={<Trash />}></Route>
            <Route path="/task/:id" element={<Taskdetails />}></Route>
          </Route>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/login" element={<Login></Login>}></Route>
        </Routes>

        <Toaster richColors />
      </main>
    </ThemeContext.Provider>
  );
}

export default App;
