import { IonButton, IonContent, IonIcon, IonInput, IonSelect, IonSelectOption, IonText } from "@ionic/react";
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
        <div className="float-right flex items-center space-x-4">
            {/* First page button */}
            <IonButton
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded-full p-2"
            >
                <IonIcon
                icon={playSkipBack}
                className="text-lg text-gray-800"
                />
            </IonButton>
    
            {/* Previous button */}
            <IonButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center justify-center bg-gray-300 hover:bg-gray-400 disabled:opacity-50 rounded-full p-2"
            >
                <IonIcon
                icon={arrowBack}
                className="text-lg text-gray-800"
                />
            </IonButton>

            {/* Current page info */}
            <IonText className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </IonText>

            {/* Dropdown to Change Items Per Page */}
            <IonSelect
                value={perPage}
                placeholder="Items per page"
                onIonChange={(e) => handlePerPageChange(e.detail.value)}
                className="text-sm text-gray-600 border border-gray-300 rounded"
                interface="popover"
            >
                <IonSelectOption value={5}>5</IonSelectOption>
                <IonSelectOption value={10}>10</IonSelectOption>
                <IonSelectOption value={20}>20</IonSelectOption>
                <IonSelectOption value={50}>50</IonSelectOption>
            </IonSelect>

            {/* Next button */}
            <IonButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 disabled:opacity-50 rounded-full p-2"
            >
                <IonIcon
                icon={arrowForward}
                className="text-lg text-white"
                />
            </IonButton>

            {/* Last page button */}
            <IonButton
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 disabled:opacity-50 rounded-full p-2"
            >
                <IonIcon
                icon={playSkipForward}
                className="text-lg text-white"
                />
            </IonButton>
        </div>
    )
}

export default PageHandler;