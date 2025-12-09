import { exportDiagramToPng } from './exportToPng';

interface ExportsPropsType {
    exportToJson: () => string | null;
    exportToRdf: () => string;
    importFromJson: (json: string) => void;
    flowWrapperRef: React.RefObject<HTMLDivElement>
}

const Exports = ({ exportToJson, flowWrapperRef, exportToRdf, importFromJson }: ExportsPropsType) => {

    const handleDownloadJson = () => {
        try {
            const json = exportToJson();
            if (!json) return;

            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "diagram.json";
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Problem exporting diagram JSON: ", e)
        }
        
    };

    const handleDownloadPng = async () => {
        if (!flowWrapperRef.current) return;
        try {
        await exportDiagramToPng(flowWrapperRef.current, 'diagram.png');
        } catch (e) {
        console.error('Problem exporting diagram PNG: ', e);
        }
    };

    const handleDownloadRdf = () => {
        try {
        const ttl = exportToRdf();
        const blob = new Blob([ttl], { type: 'text/turtle;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.ttl';
        a.click();
        URL.revokeObjectURL(url);
        } catch (e) {
        console.error('Problem exporting diagram RDF: ', e);
        }
    };

    const handleImportJson: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
        const text = await file.text();
        importFromJson(text);
        } catch (err) {
        console.error('Problem importing diagram JSON: ', err);
        } finally {
        e.target.value = ''; // reset input
        }
    };

    return (
        <>
            <div className="w-fit bg-white border border-black p-5 hover:cursor-pointer rounded-xl absolute top-4 right-4 z-10 flex">
                <button className="block w-full border border-black text-black" onClick={handleDownloadJson}>
                    Export JSON
                </button>
                <button className="block w-full border border-black text-black" onClick={handleDownloadPng}>
                    Export PNG
                </button>
                <button className="block w-full border border-black text-black" onClick={handleDownloadRdf}>
                    Export RDF
                </button>

                <label className="block w-full text-sm text-black">
                    <span className="block mb-1">Import JSON</span>
                    <input
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="block w-full text-xs"
                    />
                </label>
            </div>
        </>
    )
}

export default Exports;

