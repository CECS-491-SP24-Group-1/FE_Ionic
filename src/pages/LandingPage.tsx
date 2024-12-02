import React from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonButton,
    IonFooter
} from "@ionic/react";
import { BackgroundBeams } from "@/components/background-beams";

const LandingPage: React.FC = () => (
    <IonPage>
        {/* Header */}
        <IonHeader>
            <IonToolbar className="bg-gray-800 dark:bg-backgroundHighlight-light text-white dark:text-textPrimary-light">
                <IonTitle className="text-xl font-bold">Wraith</IonTitle>
            </IonToolbar>
        </IonHeader>

        {/* Content */}
        <IonContent
            className="h-screen overflow-y-auto text-textPrimary dark:text-textPrimary-light ion-padding"
            scrollEvents={true} // Enables scroll tracking if needed
        >
            {/* Hero Section */}
            <div className="hero mb-8">
                <IonText color="primary">
                    <h1 className="text-4xl font-bold dark:text-primary-light">
                        Welcome to Wraith!
                    </h1>
                </IonText>
                <IonText>
                    <p className="text-lg text-textSecondary dark:text-textSecondary-light">
                        Discover the amazing features we offer to make your experience better.
                    </p>
                </IonText>
                
            </div>

            {/* Features Section */}
            <div id="features" className="section mb-8">
                <IonText>
                    <h2 className="text-2xl font-semibold dark:text-primary-light">
                        Features
                    </h2>
                    <p className="text-lg text-textSecondary dark:text-textSecondary-light">
                        Explore our awesome features that can help you achieve your goals faster.
                    </p>
                </IonText>
            </div>

            {/* About Section */}
            <div id="about" className="section mb-8">
                <IonText>
                    <h2 className="text-2xl font-semibold dark:text-primary-light">
                        About Us
                    </h2>
                    <p className="text-lg text-textSecondary dark:text-textSecondary-light">
                        We are dedicated to providing top-notch services that satisfy your needs.
                    </p>
                </IonText>
            </div>

            {/* Contact Section */}
            <div id="contact" className="section mb-8">
                <IonText>
                    <h2 className="text-2xl font-semibold dark:text-primary-light">
                        Contact Us
                    </h2>
                    <p className="text-lg text-textSecondary dark:text-textSecondary-light">
                        Have questions? Get in touch with us anytime.
                    </p>
                </IonText>
            </div>

            {/* Background Beams */}
            <BackgroundBeams className="z-[-100] bg-primary bg-transparent dark:bg-primary-light" />
        </IonContent>

        {/* Footer */}
        <IonFooter>
            <IonToolbar
                className="bg-background dark:bg-backgroundHighlight-light text-textPrimary dark:text-textPrimary-light"
            >
                <IonText className="footer-text text-sm text-textSecondary dark:text-textSecondary-light">
                    © 2024 MyLanding. All rights reserved.
                </IonText>
            </IonToolbar>
        </IonFooter>
    </IonPage>
);

export default LandingPage;
