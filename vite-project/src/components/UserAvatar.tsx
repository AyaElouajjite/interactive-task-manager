import { Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { RootState } from "../redux/store";
import { toast } from "sonner";
import { logout } from "../redux/slices/authSlice";
import UserInfo from "../components/UserInfo"; // Import UserInfo
import ChangerPsw from "../components/task/ChangerPsw";

const UserAvatar = () => {
  const [open, setOpen] = useState(false); // Etat pour ouvrir/fermer le modal du profil
  const [openPassword, setOpenPassword] = useState(false); // Etat pour ouvrir/fermer le modal de changement de mot de passe
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("👋 Déconnexion réussie !");
    navigate("/"); // Redirection vers la page de login
  };

  return (
    <>
      <div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="w-10 h-10 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-blue-600">
              <span className="text-white font-semibold">
                {getInitials(user?.name)}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
              <div className="p-4">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpen(true)} // Ouvrir le modal sur click
                      className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <FaUser className="mr-2" aria-hidden="true" />
                      Profile
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setOpenPassword(true)} // Ouvrir le modal de changement de mot de passe
                      className="text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <FaUserLock className="mr-2" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logoutHandler}
                      className="text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base"
                    >
                      <IoLogOutOutline className="mr-2" aria-hidden="true" />
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Modal pour afficher les informations de l'utilisateur */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setOpen(false)} // Fermer le modal en cliquant à l'extérieur
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-96"
            onClick={(e) => e.stopPropagation()} // Empêche de fermer en cliquant à l'intérieur du modal
          >
            <UserInfo user={user} />
          </div>
        </div>
      )}

      {/* Modal pour changer le mot de passe */}
      {openPassword && (
        <ChangerPsw open={openPassword} setOpen={setOpenPassword}></ChangerPsw>
      )}
    </>
  );
};

export default UserAvatar;
