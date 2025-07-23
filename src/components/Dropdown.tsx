import Select from "react-select";
import type { SingleValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

const realWords: string[] = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita-Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo-Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
];
const options: OptionType[] = realWords.map((word) => ({
  value: word.toLowerCase(),
  label: word,
}));

const WordDropdown = () => {
  const handleChange = (option: SingleValue<OptionType>) => {
    console.log("Selected:", option);
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <Select
        options={options}
        onChange={handleChange}
        placeholder="Pick a Resident Area..."
        className="text-sm"
        classNames={{
          control: () =>
            "bg-gray-800 border border-gray-600 text-white rounded-md px-2 py-1",
          menu: () => "bg-gray-900 text-black mt-1 rounded-md shadow-md",
          option: ({ isFocused }) =>
            `px-3 py-2 cursor-pointer ${
              isFocused ? "bg-gray-700" : "bg-gray-900"
            } text-white`,
          singleValue: () => "text-white",
          placeholder: () => "text-gray-400",
        }}
        isSearchable
      />
    </div>
  );
};

export default WordDropdown;
