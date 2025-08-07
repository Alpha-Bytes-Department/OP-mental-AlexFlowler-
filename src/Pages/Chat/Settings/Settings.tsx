import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoCamera } from "react-icons/io5";

interface SettingsFormData {
  logo: FileList;
  name: string;
  address: string;
  username: string;
  description: string;
  gender: string;
}

const Settings = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SettingsFormData>({
    defaultValues: {
      name: "",
      address: "",
      username: "",
      description: "",
      gender: "",
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    console.log("Settings Form Data:", data);
  };

  // State for custom gender dropdown
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("Select Gender");
  const genderOptions = [
    "Select Gender",
    "Male",
    "Female",
    "Other",
    "Prefer not to say",
  ];

  // State for image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleGenderSelect = (value: string) => {
    setSelectedGender(value);
    setValue("gender", value === "Select Gender" ? "" : value);
    setIsOpen(false);
  };

  // Handle file upload and preview
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);

      // Update form value
      setValue("logo", event.target.files as FileList);
    }
  };

  return (
    <div className="min-h-screen text-white py-4 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold">
            General Settings
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Upload Logo Section */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <label
              htmlFor="logo-upload"
              className="cursor-pointer hover:scale-105 duration-300"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-3 border border-white p-2 sm:p-3 rounded-full flex items-center justify-center transition overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Logo preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <IoCamera size={24} className="sm:w-8 sm:h-8" />
                )}
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-base sm:text-lg font-medium">Upload Logo</p>
          </div>

          {/* Form Fields Container */}
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 justify-center items-start">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 space-y-6 sm:space-y-8">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-base sm:text-lg font-medium">
                  Name
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  type="text"
                  id="name"
                  placeholder="your name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs sm:text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-base sm:text-lg font-medium">
                  Username
                </label>
                <input
                  {...register("username", {
                    required: "Username is required",
                  })}
                  type="text"
                  id="username"
                  placeholder="your username"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base"
                />
                {errors.username && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Gender Field (Custom Dropdown) */}
              <div className="space-y-2">
                <label htmlFor="gender" className="block text-base sm:text-lg font-medium">
                  Gender
                </label>
                <div className="relative">
                  <div
                    {...register("gender", { required: "Gender is required" })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-cCard rounded-lg text-white focus:outline-none focus:border-white/60 transition-colors cursor-pointer bg-transparent flex items-center justify-between text-sm sm:text-base"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.75rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    {selectedGender}
                  </div>
                  {isOpen && (
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
                {errors.gender && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 space-y-6 sm:space-y-8">
              {/* Address Field */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-base sm:text-lg font-medium">
                  Address
                </label>
                <input
                  {...register("address", { required: "Address is required" })}
                  type="text"
                  id="address"
                  placeholder="yourname584@gmail.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors text-sm sm:text-base"
                />
                {errors.address && (
                  <p className="text-red-400 text-xs sm:text-sm">
                    {errors.address.message}
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
                  className="w-full min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border border-cCard rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white/60 transition-colors resize-none text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6 sm:pt-8">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 sm:px-12 lg:px-16 py-3 sm:py-4 bg-cCard text-black font-bold text-base sm:text-lg rounded-lg transition-all duration-200 transform hover:scale-105 max-w-xs"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;