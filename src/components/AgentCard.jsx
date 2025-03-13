import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

const StatusChip = styled(Chip)(({ theme, status }) => ({
	backgroundColor:
		status === "active"
			? theme.palette.success.main
			: status === "standby"
			? theme.palette.warning.main
			: theme.palette.error.main,
}));

const StyledCard = styled(Card)(({ theme }) => ({
	height: "100%",
	transition: "transform 0.2s",
	"&:hover": {
		transform: "scale(1.02)",
		cursor: "pointer",
	},
}));

const AgentCard = ({ agent }) => {
	return (
		<StyledCard>
			<CardContent>
				<Typography variant="h5" component="h2" sx={{ color: "primary.main" }}>
					{agent.name}
				</Typography>
				<Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
					{agent.description}
				</Typography>
				<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
					<StatusChip label={agent.status} status={agent.status} size="small" />
				</Box>
			</CardContent>
		</StyledCard>
	);
};

export default AgentCard;
