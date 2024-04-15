export type GraphData = {
  displayName: string;
  jobTitle: string;
  mail: string;
  businessPhones: string[];
  officeLocation: string;
};

export const ProfileData: React.FC<{ graphData: GraphData }> = ({
  graphData,
}) => {
  return (
    <div>
      <NameListItem name={graphData.displayName} />
      <JobTitleListItem jobTitle={graphData.jobTitle} />
      <MailListItem mail={graphData.mail} />
      <PhoneListItem phone={graphData.businessPhones[0]} />
      <LocationListItem location={graphData.officeLocation} />
    </div>
  );
};

const NameListItem: React.FC<{ name: string }> = ({ name }) => (
  <div>
    <p>{name}</p>
  </div>
);

const JobTitleListItem: React.FC<{ jobTitle: string }> = ({ jobTitle }) => (
  <div>
    <p>{jobTitle}</p>
  </div>
);

const MailListItem: React.FC<{ mail: string }> = ({ mail }) => (
  <div>
    <p>{mail}</p>
  </div>
);

const PhoneListItem: React.FC<{ phone: string }> = ({ phone }) => (
  <div>
    <p>{phone}</p>
  </div>
);

const LocationListItem: React.FC<{ location: string }> = ({ location }) => (
  <div>
    <p>{location}</p>
  </div>
);
