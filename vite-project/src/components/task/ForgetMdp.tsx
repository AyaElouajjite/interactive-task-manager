import { useForm } from "react-hook-form";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import Button from "../Button";
import axios from "axios";
import { toast } from "sonner";
import Loading from "../../components/Loader";
import { useState } from "react";

const ForgetMdp = ({ open, setOpen }: any) => {
  const [loading, setLoading] = useState(false); // état pour indiquer le chargement
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleOnSubmit = async (data: any) => {
    try {
      setLoading(true); // Active le loader avant la requête
      const response = await axios.post(
        "http://localhost:5000/api/forgot-password",
        {
          email: data.emailforget,
        }
      );

      if (response.status === 200) {
        toast.success("✅ Un email de réinitialisation a été envoyé.");
        setOpen(false);
      } else {
        toast.error(
          response.data.message || "Erreur lors de la réinitialisation."
        );
      }
    } catch (error: any) {
      console.error("Erreur de requête :", error);
      toast.error(
        error.response?.data?.message || "Échec de la connexion au serveur."
      );
    } finally {
      setLoading(false); // Désactive le loader une fois la requête terminée
    }
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Dialog.Title
          as="h2"
          className="text-base font-bold leading-6 text-gray-900 mb-4"
        >
          Mot de passe oublié
        </Dialog.Title>
        <div className="mt-2 flex flex-col gap-6">
          <Textbox
            placeholder="email@gmail.com"
            type="email"
            name="emailforget"
            label="Adresse e-mail"
            className="w-full rounded"
            register={register("emailforget", {
              required: "L'adresse e-mail est requise !",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Adresse e-mail invalide.",
              },
            })}
            error={errors.emailforget?.message || ""}
          />
        </div>
        <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
          <Button
            type="submit"
            className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
            label="Envoyer"
          />
          <Button
            type="button"
            className="bg-white border text-sm font-semibold text-gray-900"
            onClick={() => setOpen(false)}
            label="Annuler"
          />
        </div>
        {loading && (
          <div className="py-10">
            <Loading />
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};

export default ForgetMdp;
