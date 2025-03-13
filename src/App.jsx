import { useState } from "react";
import {
	Box,
	Container,
	Typography,
	TextField,
	Button,
	Paper,
	Link,
	ToggleButton,
	ToggleButtonGroup,
	CircularProgress,
	Backdrop,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormControl,
	FormLabel,
	Dialog,
	List,
	ListItem,
	ListItemText,
	Chip,
	IconButton,
	Fab,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import "./App.css";

const StyledContainer = styled(Container)({
	marginTop: "2rem",
	marginBottom: "2rem",
});

const FormContainer = styled(Box)({
	padding: "2rem",
});

const InfoBox = styled(Paper)({
	padding: "1.5rem",
	maxWidth: "500px",
	margin: "0 auto 2rem auto",
	backgroundColor: "rgba(17, 17, 17, 0.9)",
});

const LoadingBackdrop = styled(Backdrop)({
	color: "#00ff00",
	zIndex: 1000,
	flexDirection: "column",
	"& > .MuiCircularProgress-root": {
		marginBottom: "1rem",
	},
});

const AgentListContainer = styled(Paper)({
	padding: "2rem",
	backgroundColor: "rgba(17, 17, 17, 0.9)",
	marginTop: "2rem",
});

const App = () => {
	const [formData, setFormData] = useState({
		agentName: "",
		nevermindKey: "",
		apiKey: "",
		role: "builder",
	});
	const [apiType, setApiType] = useState("openai");
	const [isLoading, setIsLoading] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [agents, setAgents] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			let payload = new FormData();
			payload.append("agent-name", formData.agentName);
			payload.append("MINECRAFT_ROLE", "1.20");
			payload.append("OPENAI_API_KEY", formData.apiKey);
			payload.append("NEVERMINED_API_KEY", formData.nevermindKey);

			const response = await axios({
				method: "post",
				url: "/deploy",
				data: payload,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const newAgent = {
				name: formData.agentName,
				role: formData.role,
				status: "active",
				launchedAt: new Date().toISOString(),
			};

			setAgents([...agents, newAgent]);
			setIsFormOpen(false);
			setFormData({
				agentName: "",
				nevermindKey: "",
				apiKey: "",
				role: "builder",
			});
		} catch (error) {
			console.error("Error launching agent:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleApiTypeChange = (e, newValue) => {
		if (newValue !== null) {
			setApiType(newValue);
			setFormData({
				...formData,
				apiKey: "",
			});
		}
	};

	return (
		<div>
			<LoadingBackdrop open={isLoading}>
				<CircularProgress color="inherit" />
				<Typography variant="h6" sx={{ color: "primary.main" }}>
					Initializing and launching agent on server...
				</Typography>
			</LoadingBackdrop>

			<StyledContainer>
				<Typography
					variant="h3"
					component="h1"
					gutterBottom
					sx={{ color: "primary.main", textAlign: "center" }}
				>
					Minecraft Agents
				</Typography>
				<Typography
					variant="subtitle1"
					gutterBottom
					sx={{ color: "text.secondary", textAlign: "center", mb: 4 }}
				>
					Powered by Mother & XO
				</Typography>

				<InfoBox elevation={3}>
					<Typography
						variant="body1"
						gutterBottom
						sx={{ color: "text.primary" }}
					>
						In order to use the launcher, first register your agent as part of
						Mother registry{" "}
						<Link href="#" color="primary" underline="hover">
							here
						</Link>
						.
					</Typography>
				</InfoBox>

				<AgentListContainer elevation={3}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							mb: 3,
						}}
					>
						<Typography variant="h5" sx={{ color: "primary.main" }}>
							Active Agents
						</Typography>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => setIsFormOpen(true)}
							sx={{
								backgroundColor: "primary.main",
								color: "background.default",
								"&:hover": {
									backgroundColor: "primary.dark",
								},
							}}
						>
							Launch New Agent
						</Button>
					</Box>

					{agents.length === 0 ? (
						<Typography
							variant="body1"
							sx={{ textAlign: "center", color: "text.secondary" }}
						>
							No agents are currently running. Launch a new agent to get
							started.
						</Typography>
					) : (
						<List>
							{agents.map((agent, index) => (
								<ListItem
									key={index}
									sx={{
										backgroundColor: "rgba(0, 255, 0, 0.1)",
										borderRadius: 1,
										mb: 1,
									}}
								>
									<ListItemText
										primary={agent.name}
										secondary={`Role: ${
											agent.role.charAt(0).toUpperCase() + agent.role.slice(1)
										}`}
										sx={{
											"& .MuiListItemText-primary": { color: "primary.main" },
										}}
									/>
									<Chip
										label={agent.status}
										color="success"
										size="small"
										sx={{ ml: 2 }}
									/>
								</ListItem>
							))}
						</List>
					)}
				</AgentListContainer>

				<Dialog
					open={isFormOpen}
					onClose={() => setIsFormOpen(false)}
					maxWidth="sm"
					fullWidth
					PaperProps={{
						sx: { backgroundColor: "background.paper" },
					}}
				>
					<FormContainer>
						<Typography
							variant="h5"
							gutterBottom
							sx={{ color: "primary.main" }}
						>
							Launch New Agent
						</Typography>
						<form onSubmit={handleSubmit}>
							<TextField
								fullWidth
								label="Agent Name"
								name="agentName"
								value={formData.agentName}
								onChange={handleChange}
								margin="normal"
								variant="outlined"
								required
							/>

							<FormControl sx={{ mt: 2, mb: 1 }} required>
								<FormLabel sx={{ color: "text.secondary" }}>
									Agent Role
								</FormLabel>
								<RadioGroup
									row
									name="role"
									value={formData.role}
									onChange={handleChange}
									sx={{
										justifyContent: "center",
										"& .MuiFormControlLabel-root": {
											mx: 2,
										},
									}}
								>
									<FormControlLabel
										value="builder"
										control={<Radio sx={{ color: "primary.main" }} />}
										label="Builder"
									/>
									<FormControlLabel
										value="merchant"
										control={<Radio sx={{ color: "primary.main" }} />}
										label="Merchant"
									/>
								</RadioGroup>
							</FormControl>

							<TextField
								fullWidth
								label="Nevermind API Key"
								name="nevermindKey"
								value={formData.nevermindKey}
								onChange={handleChange}
								margin="normal"
								variant="outlined"
								type="password"
								required
							/>

							<Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
								<ToggleButtonGroup
									value={apiType}
									exclusive
									onChange={handleApiTypeChange}
									color="primary"
								>
									<ToggleButton value="openai">OpenAI</ToggleButton>
									<ToggleButton value="gaia">GaiaNet</ToggleButton>
								</ToggleButtonGroup>
							</Box>

							<TextField
								fullWidth
								label={
									apiType === "openai" ? "OpenAI API Key" : "GaiaNet Node URL"
								}
								name="apiKey"
								value={formData.apiKey}
								onChange={handleChange}
								margin="normal"
								variant="outlined"
								type={apiType === "openai" ? "password" : "text"}
								required
							/>

							<Box sx={{ display: "flex", gap: 2, mt: 3 }}>
								<Button
									onClick={() => setIsFormOpen(false)}
									fullWidth
									variant="outlined"
									sx={{ color: "text.secondary" }}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									variant="contained"
									fullWidth
									sx={{
										backgroundColor: "primary.main",
										color: "background.default",
										"&:hover": {
											backgroundColor: "primary.dark",
										},
									}}
								>
									Launch Agent
								</Button>
							</Box>
						</form>
					</FormContainer>
				</Dialog>
			</StyledContainer>
		</div>
	);
};

export default App;
