import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import myImage from "../assets/login.png";

const ResetPassword = () => {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/reset-password",
        {
          token,
          newPassword: data.newPassword,
        }
      );
      const { email, newPassword } = response.data;
      // Stocker pour pré-remplir le login
      localStorage.setItem("resetEmail", email);
      localStorage.setItem("resetPassword", newPassword);
      toast.success(
        "✅ Mot de passe réinitialisé avec succès (Le champ remplis avec le nouveau mdp)!"
      );
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center bg-[#f3f4f6] p-4">
      {/* Container principal */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:gap-16 xl:gap-24">
        {/* Partie Gauche - Image */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="cell">
            <div className="circle rotate-in-up-left"></div>
          </div>
          <img src={myImage} alt="task_app" className="hidden lg:block pb-16" />
        </div>

        {/* Partie Droite - Formulaire */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full max-w-sm flex flex-col gap-y-6 bg-white px-10 pt-14 pb-14 shadow-lg rounded-lg"
          >
            <div className="text-center">
              <p className="text-blue-600 font-bold text-2xl">Reset Password</p>
            </div>

            <div className="flex flex-col gap-y-5">
              {/* Mot de passe */}
              <div className="relative w-full">
                <Textbox
                  placeholder="your password"
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  label="New Password"
                  className="w-full rounded-full"
                  register={register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  error={errors.password?.message || ""}
                />
                {/* Bouton pour voir/cacher */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600 bt-15"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>
              {/* Confirmation du mot de passe  */}

              <div className="relative w-full">
                <Textbox
                  placeholder="Confirm your password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  label="Confirm Password"
                  className="w-full rounded-full"
                  register={register("confirmPassword", {
                    required: "Password confirmation is required",
                    validate: (value) =>
                      value === getValues("newPassword") ||
                      "Passwords do not match",
                  })}
                  error={errors.confirmPassword?.message || ""}
                />

                {/* Bouton pour voir/cacher le mot de passe */}
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-600 bt-15"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </button>
              </div>

              {/* Bouton de soumission */}
              <Button
                type="submit"
                label="Changer"
                className="w-full h-10 bg-blue-700 text-white rounded-full justify-center"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
