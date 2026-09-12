import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import FadeInSection from "./FadeInSection";

function TabPanel(props) {
  const { children, value, index, isMobile, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={isMobile ? `full-width-tabpanel-${index}` : `vertical-tabpanel-${index}`}
      aria-labelledby={isMobile ? `full-width-tab-${index}` : `vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  isMobile: PropTypes.bool
};

function a11yProps(index, isMobile) {
  if (isMobile) {
    return {
      id: "full-width-tab-" + index,
      "aria-controls": "full-width-tabpanel-" + index,
    };
  } else {
    return {
      id: "vertical-tab-" + index,
      "aria-controls": "vertical-tabpanel-" + index,
    };
  }
}

const JobList = ({ language }) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const experienceItems = language === "fr" ? {
    OUFAREZ: {
      jobTitle: "Développeur front-end Flutter @",
      duration: "CONTRAT DE 3 MOIS",
      desc: [
        "Conçu et intégré des interfaces mobiles Flutter à partir des besoins produit et des maquettes.",
        "Collaboré avec l’équipe technique pour transformer les retours utilisateurs en améliorations de fonctionnalités.",
        "Diagnostiqué et corrigé des défauts d’interface afin d’améliorer la fiabilité et l’expérience utilisateur.",
      ],
    },
    ARITED: {
      jobTitle: "Stagiaire développeur mobile Flutter @",
      duration: "JUIN 2025 - SEPT. 2025",
      desc: [
        "Développé des composants Flutter et Dart réutilisables pour accélérer la livraison des fonctionnalités mobiles.",
        "Débogué des problèmes d’interface et de comportement pour assurer une expérience cohérente sur mobile.",
        "Travaillé avec l’équipe de développement sur l’évolution des fonctionnalités et la qualité du produit.",
      ],
    },
    Innovatech: {
      jobTitle: "Stagiaire systèmes embarqués @",
      duration: "JUIL. 2022 - AOÛT 2022",
      desc: [
        "Construit des circuits électroniques et développé des programmes Arduino de contrôle pour des exercices de systèmes embarqués.",
      ],
    },
  } : {
    OUFAREZ: {
      jobTitle: "Flutter Front-End Developer @",
      duration: "3-MONTH CONTRACT",
      desc: [
        "Built and integrated Flutter mobile interfaces from product requirements and design specifications.",
        "Partnered with the technical team to translate user feedback into feature improvements.",
        "Diagnosed and resolved UI defects to improve product reliability and the user experience.",
      ],
    },
    ARITED: {
      jobTitle: "Flutter Mobile Developer Intern @",
      duration: "JUN 2025 - SEP 2025",
      desc: [
        "Developed reusable Flutter and Dart components to speed up delivery of mobile features.",
        "Debugged UI and application-behavior issues to deliver a consistent mobile experience.",
        "Worked with the development team on feature iteration and product quality improvements.",
      ],
    },
    Innovatech: {
      jobTitle: "Embedded Systems Intern @",
      duration: "JUL 2022 - AUG 2022",
      desc: [
        "Built basic electronic circuits and wrote Arduino control programs for embedded systems exercises.",
      ],
    },
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      bgcolor: "transparent", 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      height: "auto",
      minHeight: 300
    }}>
      <Tabs
        orientation={!isMobile ? "vertical" : "horizontal"}
        variant="scrollable"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
        sx={{ 
          borderRight: isMobile ? 0 : 1, 
          borderBottom: isMobile ? 1 : 0,
          borderColor: "var(--lightest-navy)",
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--green-bright)"
          },
          "& .MuiTabs-flexContainer": {
            borderBottom: isMobile ? "1px solid var(--lightest-navy)" : "none"
          }
        }}
      >
        {Object.keys(experienceItems).map((key, i) => (
          <Tab 
            key={i} 
            label={key} 
            {...a11yProps(i, isMobile)} 
            sx={{
              color: "var(--slate)",
              fontFamily: "NTR",
              fontSize: "14px",
              textAlign: isMobile ? "center" : "left",
              alignItems: isMobile ? "center" : "flex-start",
              textTransform: "none",
              padding: "10px 20px",
              minHeight: "48px",
              minWidth: isMobile ? "120px" : "auto",
              "&.Mui-selected": {
                color: "var(--green-bright)"
              },
              "&:hover": {
                color: "var(--green-bright)",
                backgroundColor: "var(--green-tint)"
              }
            }}
          />
        ))}
      </Tabs>
      <Box sx={{ flexGrow: 1 }}>
        {Object.keys(experienceItems).map((key, i) => (
          <TabPanel key={i} value={value} index={i} isMobile={isMobile}>
            <span className="joblist-job-title">
              {experienceItems[key]["jobTitle"] + " "}
            </span>
            <span className="joblist-job-company">{key}</span>
            <div className="joblist-duration">
              {experienceItems[key]["duration"]}
            </div>
            <ul className="job-description">
              {experienceItems[key]["desc"].map(function (descItem, i) {
                return (
                  <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                    <li>{descItem}</li>
                  </FadeInSection>
                );
              })}
            </ul>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default JobList;
