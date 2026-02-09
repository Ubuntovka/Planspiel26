import { X } from "lucide-react";

export default function ValidationError({ errors, handleClose }: { errors: string[] | null, handleClose: () => void }) {
    if(errors && errors.length > 0) {
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
                <a href="/validation-rules" className="text-red-900 underline"><br />Learn more about validation rules</a>
            </div>
        );
    } else {
        return (
            <div className="absolute border border-green-900 rounded-lg shadow-2xl bg-green-100 text-green-900 p-4 top-16 right-4 z-100 w-[400px] h-fit">
                <div className="flex justify-between">
                    <p className="font-bold">No Validation Errors</p>
                    <button
                        onClick={() => handleClose()}
                        className="ml-2"
                        aria-label="Close"
                    >
                        <X className="hover:cursor-pointer" />
                    </button>
                </div>
                <p className="text-sm mt-1">All WAM rules are satisfied.</p>
                <a href="/validation-rules" className="text-green-900 underline">Click here to learn more about WAM rules</a>
            </div>
        );
    }
    
    
}