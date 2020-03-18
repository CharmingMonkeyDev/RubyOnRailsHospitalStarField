import React, { ReactChild } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box
} from "@mui/material";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

type Props = {
  children: ReactChild
  title: string
  count?: number
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const PatientListsAccrodion: React.FC<Props> = ({ children, count = 0, title, isExpanded, setIsExpanded }: Props) => {
  const accordionHeight = "25px";

  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => setIsExpanded(!isExpanded)}
      sx={{
        boxShadow: "none",
        border: "none",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={null}
        sx={{
          padding: 0,
          minHeight: accordionHeight,
          "&.MuiAccordionSummary-root": {
            minHeight: accordionHeight,
          },
          "&.MuiAccordionSummary-gutters": {
            padding: 0,
            minHeight: accordionHeight,
          },
          "&.Mui-expanded": {
            minHeight: accordionHeight,
          },
          "& .MuiAccordionSummary-content": {
            margin: 0,
            alignItems: "center",
            minHeight: accordionHeight,
          },
          "& .MuiAccordionSummary-contentGutters": {
            margin: 0,
            minHeight: accordionHeight,
          },
          "& .MuiAccordionSummary-content.Mui-expanded": {
            margin: 0,
            minHeight: accordionHeight,
            alignItems: "center",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            p: "0 20px 0 12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transform: isExpanded
                ? "rotate(180deg)"
                : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            <ArrowDropDownIcon />
          </Box>
          <div className='collapse-list'>
            <p className="collapse-list-header">{title}</p>
            {count > 0 &&
              <div className='collapse-list-count'>{count}</div>
            }
          </div>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: 0,
          backgroundColor: "#F8F8F8",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

export default PatientListsAccrodion