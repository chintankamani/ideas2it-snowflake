import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { fieldKey, fields, pricing } from "../constants";

const labelClass = "text-sm text-[#474747]";
const formGroup = "flex flex-col gap-1";

const NumberInput = ({
  field,
  value,
  unitOptions,
  unit,
  register,
  onUnitChange,
  setValue
}) => {
  const { min, max, step,defaultValue } = field;


  const decrement = () => {
    if (Number(value) - step >= min) {
      setValue(field.key,Number(value) - step);
    }
  };

  const increment = () => {
    if ((Number(value) + step) <= max) {
      setValue(field.key,Number(value) + step);
    }
  };

  return (
    <div className="flex items-center justify-between w-32 px-2 py-1 border-2 border-gray-300 rounded-md sm:w-36 md:py-2">
      {!unitOptions && (
        <button type="button" onClick={decrement}>
          <img
            className="w-[14px] h-[14px]"
            src={
              value === min || value === 0
                ? "https://uploads-ssl.webflow.com/64f810ca98a7e2ef2f6761ef/6673d3ddfd56c8a45ab9d2bf_minus.svg"
                : "https://uploads-ssl.webflow.com/64f810ca98a7e2ef2f6761ef/6673d3dd1a9a9437d7136c59_darkMinus.png"
            }
            alt="minus button"
          />
        </button>
      )}
      <input
        type="number"
        defaultValue={defaultValue || min}
        {...register(field.key)}
        onFocus={e => e.target.select()}
        step={step}
        min={min}
        max={max}
        className="text-center bg-transparent appearance-none text-custom_purple"
        style={{ MozAppearance: "textfield" }}
      />
      {!unitOptions && (
        <button type="button" onClick={increment}>
          <img
            className="w-[14px] h-[14px]"
            src="https://uploads-ssl.webflow.com/64f810ca98a7e2ef2f6761ef/6673d3dd06c001a7e801751c_plus.svg"
            alt="plus button"
          />
        </button>
      )}
      {unitOptions && (
        <select
          disabled
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="ml-2 font-medium bg-transparent appearance-none !text-custom_purple opacity-100"
          style={{
            MozAppearance: "none",
            WebkitAppearance: "none",
            appearance: "none",
          }}
        >
          {unitOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

const FieldGenerator = ({ register, field, watch, setValue }) => {
  const platform = watch(fieldKey.PLATFORM);
  const value = watch(field.key);
  const unitValue = watch(`${field.key}_unit`);

  if (field.key === fieldKey.GEOGRAPHY && platform) {
    const geoLocations = pricing.Providers[platform]?.geoLocations || {};
    field.values = Object.entries(geoLocations).map(([key, location]) => ({
      value: key,
      name: location.displayName,
    }));
  }

  const unitOptions =
    field.label === "Est. storage per month "
      ? ["TB"]
      : field.label === "Duration of each session"
      ? ["mins"]
      : null;

  return (
    <div className={formGroup}>
      <label className={labelClass} htmlFor={field.key}>
        {field.label}
      </label>
      <div className="text-custom_purple">
        {field.type === 1 && field.key === fieldKey.GEOGRAPHY && (
          <select
            className="bg-custom_purple bg-opacity-5 py-[6px] pl-3 pr-[100px] md:pr-[140px]"
            {...register(field.key)}
          >
            {field.values.map((e) => (
              <option key={e.value} value={e.value}>
                {e.name}
              </option>
            ))}
          </select>
        )}

         {field.type === 1 && field.key === fieldKey.STORAGETYPE && (
         <div className="flex flex-wrap gap-4 md:flex-row">
          {field.values.map((e) => (
            <div key={e.value} className="flex items-center">
              <input
                type="radio"
                id={`${field.key}-${e.value}`}
                {...register(field.key)}
                value={e.value}
                className="hidden peer"
              />
              <label
                htmlFor={`${field.key}-${e.value}`}
                className={`w-auto py-[6px] px-3 rounded-md peer-checked:bg-custom_purple peer-checked:text-white ${
                  e.value !== watch(field.key)
                    ? "bg-custom_purple bg-opacity-5 text-custom_purple"
                    : ""
                }`}
              >
                {platform == 'aws' ? e.name : e.altName ? e.altName : e.name}
              </label>
            </div>
          ))}
        </div>
        )}
      </div>
      {field.type === 1 && field.key !== fieldKey.GEOGRAPHY && field.key !== fieldKey.STORAGETYPE && (
        <div className="flex flex-wrap gap-4 md:flex-row">
          {field.values.map((e) => (
            <div key={e.value} className="flex items-center">
              <input
                type="radio"
                id={`${field.key}-${e.value}`}
                {...register(field.key)}
                value={e.value}
                className="hidden peer"
              />
              <label
                htmlFor={`${field.key}-${e.value}`}
                className={`w-auto py-[6px] px-3 rounded-md peer-checked:bg-custom_purple peer-checked:text-white ${
                  e.value !== watch(field.key)
                    ? "bg-custom_purple bg-opacity-5 text-custom_purple"
                    : ""
                }`}
              >
                {e.name}
              </label>
            </div>
          ))}
        </div>
      )}
      {field.type === 2 && (
        <NumberInput
          field={field}
          register={register}
          value={value || 0}
          unitOptions={unitOptions}
          unit={unitValue || (unitOptions ? unitOptions[0] : "")}
          onUnitChange={(unit) => setValue(`${field.key}_unit`, unit)}
          setValue={setValue}
        />
      )}
    </div>
  );
};

function WarehouseForm({ defaultValues, onSave, onCancel }) {
  const [showInfo, setShowInfo] = useState(true);
  const { register, handleSubmit, reset, watch, setValue,getValues } = useForm({
    defaultValues,
  });
  const platform = watch(fieldKey.PLATFORM);
  const oldPlatform = defaultValues ? defaultValues[fieldKey.PLATFORM] : platform

  useEffect(() => {

    const geoLocations =
      pricing.Providers[platform || "aws"]?.geoLocations || {};
    const locations = Object.entries(geoLocations).map(([key, location]) => ({
      value: key,
      name: location.displayName,
    }));
    if (oldPlatform != platform) {
    console.log('platofmr geogrpay',platform ,oldPlatform)
      setValue("geography", locations[0].value);
    }
  }, [platform]);

  const onSubmit = (data) => {
    onSave(data);
    reset();
    setShowInfo(false);
  };

  return (
    <form
      className="bg-[#F9F9FF] pt-[20px] mt-[20px] rounded-2xl lg:px-0 md:mx-auto max-w-[820px] mb-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 pl-5 gap-y-[27px] gap-x-[41px] ">
        {fields
          .filter((field) => field.type !== 2)
          .map((field) => (
            <FieldGenerator
              key={field.key}
              register={register}
              field={field}
              watch={watch}
              setValue={setValue}
            />
          ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 pl-5 gap-y-[27px] gap-x-[41px] mt-10 ">
        {fields
          .filter((field) => field.type === 2)
          .map((field) => (
            <FieldGenerator
              key={field.key}
              register={register}
              field={field}
              watch={watch}
              setValue={setValue}
            />
          ))}
      </div>
      <div className="mt-[39px] flex gap-10 pb-5 justify-center">
        <button
          className="flex gap-2 py-[11px] px-4 border-2 border-custom_purple bg-custom_purple bg-opacity-5 rounded-md text-custom_purple font-medium"
          type="submit"
        >
          Calculate
          <img src="https://uploads-ssl.webflow.com/64f810ca98a7e2ef2f6761ef/6673d3dd4350dea264c0ea70_rightArrow.png" alt="arrow" className="w-6 h-auto" />
        </button>
      </div>
    </form>
  );
}

export default WarehouseForm;
