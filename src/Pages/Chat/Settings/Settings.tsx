import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoCamera, IoPencil, IoSave, IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";

interface SettingsFormData {
  logo: FileList;
  name: string;
  phone: string;
  username: string;
  description: string;
  gender: string;
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
      phone: userData.phone || "",
      username: userData.username || "",
      description: userData.description || "",
      gender: userData.gender || "",
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
      formData.append("phone", data.phone || "");
      formData.append("username", data.username);
      formData.append("description", data.description || "");
      formData.append("gender", data.gender);

      // Only append profile_image if a file was selected
      if (data.logo && data.logo.length > 0) {
        formData.append("profile_image", data.logo[0]);
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.patch("/api/users/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Settings updated successfully:", response.data);
      if (response.status === 200 || response.status === 201) {
        setTimeout(async () => {
          const userDetail = await axios.get("/api/users/profile/");
          console.log("User details fetched successfully:", userDetail.data);

          // Update local state and localStorage
          const updatedUser = userDetail.data;
          setUserData(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Update form values with new data
          reset({
            name: updatedUser.name || "",
            phone: updatedUser.phone || "",
            username: updatedUser.username || "",
            description: updatedUser.description || "",
            gender: updatedUser.gender || "",
          });

          // Update gender dropdown
          setSelectedGender(updatedUser.gender || "Select Gender");

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Select Gender");
  const genderOptions = ["Select Gender", "Men", "Women", "Other"];

  // State for image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Update form when userData changes
  useEffect(() => {
    reset({
      name: userData.name || "",
      phone: userData.phone || "",
      username: userData.username || "",
      description: userData.description || "",
      gender: userData.gender || "",
    });
    setSelectedGender(userData.gender || "Select Gender");

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

  const handleGenderSelect = (value: string) => {
    if (!isEditing) return;
    setSelectedGender(value);
    const genderValue = value === "Select Gender" ? "" : value;
    setValue("gender", genderValue);
    setIsOpen(false);
  };

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
        phone: userData.phone || "",
        username: userData.username || "",
        description: userData.description || "",
        gender: userData.gender || "",
      });
      setSelectedGender(userData.gender || "Select Gender");

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
            <p className="text-base text-hCard sm:text-lg font-medium text-center">
              {userData.email}
            </p>
          </div>

          {/* Form Fields Container */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 justify-center items-start">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 space-y-6 sm:space-y-8">
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

              {/* Gender Field (Custom Dropdown) */}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-base sm:text-lg font-medium"
                >
                  Gender
                </label>
                <div className="relative">
                  <input
                    type="hidden"
                    {...register("gender")}
                    value={
                      selectedGender === "Select Gender" ? "" : selectedGender
                    }
                  />
                  <div
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-cCard rounded-lg text-white focus:outline-none focus:border-white/60 transition-colors bg-transparent flex items-center justify-between text-sm sm:text-base ${
                      isEditing
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-70"
                    }`}
                    onClick={() => isEditing && setIsOpen(!isOpen)}
                    style={{
                      backgroundImage: isEditing
                        ? `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`
                        : "none",
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    {selectedGender}
                  </div>
                  {isOpen && isEditing && (
                    <div className="absolute w-full mt-1 border border-cCard rounded-lg z-10 max-h-48 overflow-y-auto">
                      {genderOptions.map((option) => (
                        <div
                          key={option}
                          className="px-3 sm:px-4 py-2 bg-cCard text-black duration-300 font-semibold hover:bg-opacity-80 cursor-pointer text-sm sm:text-base first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => handleGenderSelect(option)}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.gender && isEditing && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 space-y-6 sm:space-y-8">
              {/* Phone Field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-base sm:text-lg font-medium"
                >
                  Phone Number
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  id="phone"
                  placeholder="your phone number"
                  disabled={!isEditing}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base ${
                    !isEditing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
                {errors.phone && isEditing && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-base sm:text-lg font-medium"
                >
                  Description
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  rows={4}
                  placeholder="your information here!"
                  disabled={!isEditing}
                  className={`w-full min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors resize-none text-sm sm:text-base ${
                    !isEditing ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                />
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
