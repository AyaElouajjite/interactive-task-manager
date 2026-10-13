import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const ChangerPsw = ({ open, setOpen }: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues, // Ajout pour récupérer la valeur des champs
  } = useForm();

  const handleOnSubmit = async (data: any) => {
    try {
      // Envoie la requête PUT au backend pour changer le mot de passe
      const res = await axios.put(
        "http://localhost:5000/api/change-password", // URL de ton API
        {
          oldPassword: data.psw,
          newPassword: data.newpsw,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Envoi du token JWT dans l'en-tête
          },
        }
      );

      // Si la requête réussit, affiche un message de succès
      toast.success(res.data.message || "Mot de passe changé avec succès !");

      reset(); // Réinitialise le formulaire
      setOpen(false); // Ferme le modal
      dispatch(logout()); //deconnexion supprimer le token
      navigate("/"); // Redirection vers la page de login
    } catch (error: any) {
      // Si une erreur survient, affiche un message d'erreur
      toast.error(
        error.response?.data?.message || "Échec du changement de mot de passe."
      );
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            Changer Password
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-600 bt-15"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "👁️" : "🔒"}
            </button>
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Current password"
              type={showPassword ? "text" : "password"}
              name="psw"
              label="Current password"
              className="w-full rounded"
              register={register("psw", {
                required: "field required!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.psw ? errors.psw.message : ""}
            />

            <div className="flex items-center gap-4">
              <Textbox
                placeholder="new password"
                type={showPassword ? "text" : "password"}
                name="newpsw"
                label="new password"
                className="w-full rounded"
                register={register("newpsw", {
                  required: "field required required!",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.newpsw ? errors.newpsw.message : ""}
              />
              <Textbox
                placeholder="confirm new password"
                type={showPassword ? "text" : "password"}
                name="confirmpsw"
                label="confirm new password"
                className="w-full rounded"
                register={register("confirmpsw", {
                  required: "field required!",
                  validate: (value) =>
                    value === getValues("newpsw") || "Passwords do not match",
                })}
                error={errors.confirmpsw ? errors.confirmpsw.message : ""}
              />
            </div>
          </div>
          <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
            <Button
              type="submit"
              className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
              label="change"
            />

            <Button
              type="button"
              className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={() => setOpen(false)}
              label="Cancel"
            />
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default ChangerPsw;
