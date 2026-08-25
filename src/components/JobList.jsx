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

const JobList = () => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const experienceItems = {
    OUFAREZ: {
      jobTitle: "Flutter Front-End Developer @",
      duration: "3-MONTH CONTRACT",
      desc: [
        "Developed and integrated mobile user interfaces using Flutter.",
        "Contributed to feature design and user requirements analysis.",
        "Collaborated with the technical team, resolved bugs, and improved the overall user experience.",
      ],
    },
    ARITED: {
      jobTitle: "Flutter Mobile Developer Intern @",
      duration: "JUN 2025 - SEP 2025",
      desc: [
        "Developed mobile user interfaces and reusable components using Flutter and Dart.",
        "Debugged applications and resolved UI and interface issues.",
        "Collaborated with the development team on application development and feature improvements.",
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
