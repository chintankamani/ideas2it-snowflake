import { useEffect, useState } from "react";
import "./App.css";
import HeroSection from "./components/HeroSection";
import Info from "./components/Info";
import WarehouseForm from "./components/WarehouseForm";
import WarehouseManager from "./components/WarehouseManager";
import { fieldKey } from "./constants";
// import { montserrat } from "./font";

function App() {
  const [currentView, setCurrentView] = useState("initial");
  const [initialWarehouseData, setInitialWarehouseData] = useState(null);

  const handleWarehouseFormSave = (data) => {
    console.log(data);
    setInitialWarehouseData(data);
    setCurrentView("hubspot");
  };

  const handleHubspotSubmission = () => {
    setTimeout(() => {
      setCurrentView("warehouseManager");
    }, 1500);
  };

  useEffect(() => {
    if (currentView === "hubspot") {
      const script = document.createElement("script");
      script.src = "https://js.hsforms.net/forms/embed/v2.js";
      document.body.appendChild(script);

      script.addEventListener("load", () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            region: "na1",
            portalId: "24031861",
            formId: "e2857982-a11e-494b-a5e3-cae149755208",
            target: '#hubspotForm',
            onFormReady: (form) => {
              const field = form.querySelector('input[name="calculator_values"]')
              field.value = JSON.stringify(initialWarehouseData)
            },  
            onFormSubmitted: handleHubspotSubmission,
            submitText: 'View Cost',
            // submitButtonClass: 'btnSubmit'
          });
        }
      });

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [currentView]);

  return (
    <body>
      <section className="z-20 bg-white">
        {(currentView === "initial" || currentView === "hubspot") && (
          <>
            <div>
              <HeroSection />
              {currentView === "initial" && <Info />}
              <section className="flex flex-col ">
                {currentView === "initial" && (
                  <WarehouseForm
                    defaultValues={{
                      [fieldKey.CATEGORY]: 'Standard',
                      [fieldKey.PLATFORM]: 'aws',
                      [fieldKey.STORAGETYPE]: 'onDemand',
                      [fieldKey.SIZE]: 'S'


                    }}
                    onSave={handleWarehouseFormSave}
                    onCancel={() => {}}
                  />
                )}
                {currentView === "hubspot" && (
                  <div className="flex flex-col gap-4 px-5 pt-10 pb-8">
                    {/* Embed your HubSpot form here */}
                    <h2 className="text-2xl max-w-[800px] mx-auto">
                      You are just a step away from seeing the cost.{" "}
                    </h2>
                    <p className="text-xl max-w-[485px] mx-auto">
                      Enter your name and email address to continue.
                    </p>
                    <div className="max-w-[540px] w-full mx-auto" id="hubspotForm"></div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {currentView === "warehouseManager" && (
          <section>
            <WarehouseManager initialWarehouseData={initialWarehouseData} />
          </section>
        )}
      </section>
    </body>
  );
}

export default App;
