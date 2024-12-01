import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { arrowBack, arrowForward, playSkipBack, playSkipForward } from "ionicons/icons";
import React from "react";

// Pass in the useStates of pagination info from the parent
interface PaginationDetails {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>

    totalPages: number;

    perPage: number;
    setPerPage: React.Dispatch<React.SetStateAction<number>>
}

const PageHandler:React.FC<PaginationDetails> = ({currentPage, setCurrentPage, totalPages, perPage, setPerPage}) => {
    // Go to the next page
    const handleNextPage = () => {
        if(currentPage < totalPages)
            setCurrentPage(currentPage + 1);
    }

    // Go to the previous page
    const handlePrevPage = () => {
        if(currentPage > 1)
            setCurrentPage(currentPage - 1);
    }

    // Go to the first page
    const handleFirstPage = () => {
        setCurrentPage(1);
    }

    // Go to the last page
    const handleLastPage = () => {
        setCurrentPage(perPage);
    }

    // Change the amount of items per page and move back to the first page
    const handlePerPageChange = (amount: number) => {
        setPerPage(amount);
        setCurrentPage(1);
    }

    return (
        <div className="flex items-center justify-center space-x-4 rounded-lg p-3">
            {/* First page button */}
            <IonButton
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2"
            >
                <IonIcon icon={playSkipBack} className="text-xl text-white" />
            </IonButton>

            {/* Previous button */}
            <IonButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2"
            >
                <IonIcon icon={arrowBack} className="text-xl text-white" />
            </IonButton>

            {/* Current page info */}
            <div className="w-36 text-center">
                <IonText className="text-sm text-gray-300">
                    Page <span className="font-semibold">{currentPage}</span> of {" "}
                    <span className="font-semibold">{totalPages}</span>
                </IonText>
            </div>

            {/* Dropdown to Change Items Per Page */}
            <>
                <IonText className="text-sm text-gray-300">page items: </IonText>
                <IonSelect
                    value={perPage}
                    placeholder="Items per page"
                    onIonChange={(e) => handlePerPageChange(e.detail.value)}
                    className="text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg"
                    interface="popover"
                >
                    <IonSelectOption value={5}>5</IonSelectOption>
                    <IonSelectOption value={10}>10</IonSelectOption>
                    <IonSelectOption value={20}>20</IonSelectOption>
                    <IonSelectOption value={50}>50</IonSelectOption>
                </IonSelect>
            </>
            

            {/* Next button */}
            <IonButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2"
            >
                <IonIcon icon={arrowForward} className="text-xl text-white" />
            </IonButton>

            {/* Last page button */}
            <IonButton
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2"
            >
                <IonIcon icon={playSkipForward} className="text-xl text-white" />
            </IonButton>
        </div>
    )
}

export default PageHandler;