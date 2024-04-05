import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

function MultipleAccordions({ data }) {
    const [expanded, setExpanded] = React.useState(0); // Set initial state to 0 for the first accordion

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div>
            {data.map((item, index) => (
                <Accordion
                    key={index}
                    expanded={expanded === index} // Check if current accordion index matches expanded state
                    onChange={handleChange(index)}
                    sx={{
                        "&.Mui-expanded": {
                            boxShadow: "0px 0px 5px 1px  hsl(187, 51%, 52%)"
                        }
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                    >
                        <IconButton
                            onClick={(event) => {
                                event.stopPropagation();
                                setExpanded(index); // Open current accordion on click
                            }}
                            edge="end"
                            aria-label="expand"
                        >
                        </IconButton>
                        <Typography sx={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>{item.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{item.content}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
}

export default MultipleAccordions;
