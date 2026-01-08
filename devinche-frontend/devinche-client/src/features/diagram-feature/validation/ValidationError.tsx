import { X } from "lucide-react";

export default function ValidationError({ errors, handleClose }: { errors: string[] | null, handleClose: () => void }) {
    return (
        <div className="absolute border border-red-900 rounded-lg shadow-2xl bg-red-100 text-red-900 p-4 top-16 right-4 z-100 w-[400px] h-fit">
            <div className="flex justify-between">
                <p className="font-bold">Validation Errors</p>
                <button
                    onClick={() => handleClose()}
                    className="ml-2"
                    aria-label="Close"
                >
                    <X className="hover:cursor-pointer" />
                </button>
            </div>
            <ul className=" list-disc list-inside">
                {errors && errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        </div>
    );
}