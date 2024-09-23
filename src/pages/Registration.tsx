import { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText
} from "@ionic/react";
import "./Registration.scss"; 
import logo from "../assets/images/glock_primary.svg";
import backgroundImage from "../assets/images/registration-background.jpg";


const Registration: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [month, setMonth] = useState<string | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic
  };

  return (
    <IonPage>
      <IonContent className="registration-page">
        <div className = "logo-container">
            <img src={logo} alt="Wraith Logo" className="logo" />
            <p className="logo-text">Wraith</p> 
        </div>

        <div className="registration-container">
          <h2>Create an account</h2>
          
          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <IonItem>
              <IonLabel position="stacked">
              Email {email === "" && <span style={{ color: "red" }}>*</span>}
                </IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e:CustomEvent) => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            {/* Username Input */}
            <IonItem>
              <IonLabel position="stacked">
              Username {username === "" && <span style={{ color: "red" }}>*</span>}
                </IonLabel>
              <IonInput
                value={username}
                onIonChange={(e:CustomEvent) => setUsername(e.detail.value!)}
                required
              />
            </IonItem>

            {/* Date of Birth - Month, Day, Year */}
            <div className="dob-section">
            <IonLabel>
                Date of Birth{" "}
                {(month === null || day === null || year === null) && (
                <span style={{ color: "red" }}>*</span>
                )}
            </IonLabel>
              <div className="dob-inputs">
                <IonSelect
                  shape="round"
                  placeholder="Month"
                  value={month}
                  onIonChange={(e:CustomEvent) => setMonth(e.detail.value)}
                >
                 {months.map((monthName) => (
                    <IonSelectOption key={monthName} value={monthName}>
                    {monthName}
                    </IonSelectOption>
                ))}
                </IonSelect>

                <IonSelect
                 shape="round"
                  placeholder="Day"
                  value={day}
                  onIonChange={(e:CustomEvent) => setDay(e.detail.value)}
                >
                  {Array.from({ length: 31 }, (_, i) => (
                    <IonSelectOption key={i} value={i + 1}>
                      {i + 1}
                    </IonSelectOption>
                  ))}
                </IonSelect>

                <IonSelect
                  shape="round"
                  placeholder="Year"
                  value={year}
                  onIonChange={(e:CustomEvent) => setYear(e.detail.value)}
                >
                  {Array.from({ length: 100 }, (_, i) => (
                    <IonSelectOption key={i} value={2024 - i}>
                      {2024 - i}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </div>

            {/* Continue Button */}
            <IonButton shape="round" expand="full" type="submit" className="continue-button">
              Continue
            </IonButton>

            {/* Footer Text */}
            <p className="terms-text">
              By registering, you agree to Wraith’s{" "}
              <IonText color="primary">Terms of Service</IonText> and{" "}
              <IonText color="primary">Privacy Policy</IonText>.
            </p>
            <p className="login-text">
              Already have an account? <IonText color="primary">Log in</IonText>.
            </p>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Registration;
