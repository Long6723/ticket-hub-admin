import { Helmet } from "react-helmet";

interface SeoProps {
  title: string;
  description?: string;
  keywords?: string;
}

const Seo: React.FC<SeoProps> = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title} </title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  );
};

export default Seo;
