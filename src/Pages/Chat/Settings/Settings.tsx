import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoCamera, IoPencil, IoSave, IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";

interface SettingsFormData {
  logo: FileList;
  name: string;
  username: string;
}

const Settings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [userData, setUserData] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  });
  const axios = useAxios();
  const baseUrl = "http://10.10.12.53:8000"; // Uncomment and use your base URL

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SettingsFormData>({
    defaultValues: {
      name: userData.name || "",
      username: userData.username || "",
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    console.log("Settings Form Data:", data);
    setLoading(true);
    try {
      // Create FormData for proper file upload handling
      const formData = new FormData();

      // Append text fields
      formData.append("name", data.name);
      formData.append("username", data.username);

      // Only append profile_image if a file was selected
      if (data.logo && data.logo.length > 0) {
        formData.append("profile_image", data.logo[0]);
      }
;
  

      const response = await axios.patch("/api/users/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Settings updated successfully:", response.data);
      if (response.status === 200 || response.status === 201) {
        setTimeout(async () => {
          const userDetail = await axios.get("/api/users/profile/");
          // Update local state and localStorage
          const updatedUser = userDetail.data;
          setUserData(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Update form values with new data
          reset({
            name: updatedUser.name || "",
            username: updatedUser.username || "",
          });

          // Update profile image preview
          setPreviewImage(
            updatedUser.profile_image
              ? `${baseUrl}${updatedUser.profile_image}`
              : null
          );

          // Turn off edit mode
          setIsEditing(false);

          Swal.fire({
            title: "Success!",
            text: "Profile Update successful.",
            icon: "success",
            confirmButtonText: "OK",
            background: "rgba(255, 255, 255, 0.1)",
            backdrop: "rgba(0, 0, 0, 0.4)",
            customClass: {
              popup: "glassmorphic-popup",
              title: "glassmorphic-title",
              htmlContainer: "glassmorphic-text",
              confirmButton: "glassmorphic-button",
            },
          });
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      setLoading(false);

      Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // State for custom gender dropdown


  // State for image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Update form when userData changes
  useEffect(() => {
    reset({
      name: userData.name || "",
      username: userData.username || "",
    });

    // Fix profile image URL construction
    if (userData.profile_image) {
      const imageUrl = userData.profile_image.startsWith("http")
        ? userData.profile_image
        : `${baseUrl}${userData.profile_image}`;
      setPreviewImage(imageUrl);
    } else {
      setPreviewImage(null);
    }
  }, [userData, reset, baseUrl]);



  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Invalid File!",
          text: "Please select an image file.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "File Too Large!",
          text: "Please select an image smaller than 5MB.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Update form value
      setValue("logo", event.target.files as FileList);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Cancel edit - reset form to original values
      reset({
        name: userData.name || "",
        username: userData.username || ""
      });

      // Reset preview image
      if (userData.profile_image) {
        const imageUrl = userData.profile_image.startsWith("http")
          ? userData.profile_image
          : `${baseUrl}${userData.profile_image}`;
        setPreviewImage(imageUrl);
      } else {
        setPreviewImage(null);
      }
    }
    setIsEditing(!isEditing);
  };

  const getProfileImage = () => {
    if (previewImage) {
      return (
        <img
          src={previewImage}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            console.error("Error loading image:", previewImage);
            setPreviewImage(null);
          }}
        />
      );
    }
    return <FaUserCircle size={48} className="text-white/70" />;
  };

  return (
    <div className="min-h-screen text-white py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 flex justify-center items-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            General Settings
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* Upload Logo Section */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <label
              htmlFor={isEditing ? "logo-upload" : undefined}
              className={`${
                isEditing ? "cursor-pointer hover:scale-105" : "cursor-default"
              } duration-300 relative`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3 border border-white/30 p-1 rounded-full flex items-center justify-center transition overflow-hidden bg-gray-800/50">
                {getProfileImage()}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <IoCamera size={24} className="text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              )}
            </label>
            <p className="text-base sm:text-lg font-medium text-center">
              {isEditing
                ? "Click to Upload Profile Picture"
                : "Profile Picture"}
            </p>
          </div>

          {/* Form Fields Container */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 justify-center items-start">
            {/* Left Column */}
            <div className="w-full flex flex-col md:flex-row gap-10 max-w-md mx-auto lg:mx-0">
              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-base sm:text-lg font-medium"
                >
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  id="name"
                  placeholder="your name"
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base ${
                    !isEditing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
                {errors.name && isEditing && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-base sm:text-lg font-medium"
                >
                  Username
                </label>
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  id="username"
                  placeholder="your username"
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base ${
                    !isEditing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
                {errors.username && isEditing && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Button - Only show when editing */}
          <div className="flex justify-center pt-6 sm:pt-8">
            {isEditing && (
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer disabled:opacity-50 sm:w-auto px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-cCard text-black font-bold text-base sm:text-lg rounded-lg transition-all duration-200 transform hover:scale-105 max-w-xs flex items-center justify-center gap-2"
              >
                <IoSave size={20} />
                {loading ? "Saving..." : "Save Settings"}
              </button>
            )}
          </div>
        </form>

        <div className="flex justify-center pt-5">
          <button
            type="button"
            onClick={toggleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-transparent border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isEditing ? (
              <>
                <IoClose size={20} />
                <span className="hidden sm:inline">Cancel</span>
              </>
            ) : (
              <>
                <IoPencil size={20} />
                <span className="hidden sm:inline">Edit Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
