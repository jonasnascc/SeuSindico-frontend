import { Step, StepButton, StepLabel, Stepper, ThemeProvider } from "@mui/material";
import { theme } from "./styles";

type FormStepperProps = {
    steps : string[],
    onStepChange : (index:number) => void,
    activeStep : number,
    completedSteps ?: number[],
    errorSteps ?: number[]
}

export const FormStepper = ({steps, activeStep, completedSteps = [], errorSteps= [], onStepChange} : FormStepperProps) => {

    const handleStepChange = (index : number) => {
        onStepChange(index)
    }

    const isStepCompleted = (index : number) => {
        return completedSteps.includes(index)
    }

    const isStepError = (index : number) => {
        return errorSteps.includes(index)
    }

    return (
        <ThemeProvider theme={theme}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step 
                        key={label} 
                        active={index === activeStep}
                        completed={index!==activeStep && isStepCompleted(index)}
                    >
                        <StepButton onClick={() => handleStepChange(index)}>
                            <StepLabel error={index!==activeStep && isStepError(index)}>
                                {label}
                            </StepLabel>
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
        </ThemeProvider>
        
    )
}