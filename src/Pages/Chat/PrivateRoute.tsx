import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const timer = setTimeout(() => {
            const access = localStorage.getItem("access");
            if (!access) {
                Swal.fire({
                    title: "Authentication Required",
                    text: "You must be logged in to access this page.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Go to Login",
                    cancelButtonText: "Go to Home",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdrop: "rgba(0, 0, 0, 0.4)",
                    customClass: {
                        popup: "glassmorphic-popup",
                        title: "glassmorphic-title",
                        htmlContainer: "glassmorphic-text",
                        confirmButton: "glassmorphic-button",
                        cancelButton: "glassmorphic-button",
                    },
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/login", { state: { from: location }, replace: true });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        navigate("/", { replace: true });
                    }
                });
            } else {
                setLoading(false);
            }
        }, 500); // simulate loading
        return () => clearTimeout(timer);
    }, [navigate, location]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[url('/background.png')]">
                <HashLoader color="#dbe981" />
            </div>
        );
    }

    return <>{children}</>;
};

export default PrivateRoute;
