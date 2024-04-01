type HashtagItemProps = {
  company: string;
  onSelectCompany: (company: string) => void;
};

export const HashtagItem = ({ company, onSelectCompany }: HashtagItemProps) => {
  return (
    <li>
      <button
        onClick={() => {
          onSelectCompany(company);
        }}
      >
        #{company}
      </button>
    </li>
  );
};
