import Autcomplete from "@/components/Autocomplete";

const DATA = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "cramberry",
  "gooseberry",
  "fig",
  "plum",
  "watermelon",
  "musk melon",
];

const page = () => {
  return (
    <section className="h-full w-full">
      <div className="mt-40">
        <Autcomplete data={DATA} />
      </div>
    </section>
  );
};

export default page;
