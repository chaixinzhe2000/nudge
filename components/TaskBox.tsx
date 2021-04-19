import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Moment, { parseTwoDigitYear } from "moment";
import { Feather } from '@expo/vector-icons';
import moment from "moment";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={14} style={{ marginTop: 1 }} {...props} />;
}

interface ITaskBoxProps {
	priority: string,
	title: string,
	dueDate: any,
	completionStatus: string
}

function TaskBox(props: ITaskBoxProps) {
	const setBackgroundColor = (pLevel: string, status: string, due: any) => {
		if (status === 'finished') {
			return '#7a7a7a';
		}

		const today = moment();
		if (today.diff(due) > 0) {
			return '#e93342';
		}

		if (pLevel === 'high') {
			return '#f58822';
		} else if (pLevel === 'low') {
			return '#498bef'
		} else {
			return '#2cb9b0';
		}
	};

	const setStatus = (status: string) => {
		if (status === 'finished') {
			return 'line-through';
		} else {
			return 'none';
		}
	}

	const parseDate = (m: any) => {
		const date = moment(m).format('MMM D');
		const uDate = date.toUpperCase();
		const time = moment(m).format('h:mm A');

		const calendar = (moment(m).calendar().split(' at'))[0];
		if (calendar === 'Today') {
			return ('TDY ' + time);
		} else if (calendar === 'Tomorrow') {
			return ('TMR ' + time);
		} else {
			return (uDate);
		}
	}

	const setDisplay = (status: string) => {
		if (status === 'finished') {
			return 'none';
		} else {
			return 'flex';
		}
	}

	const parseTitle = (title: string) => {
		return title.slice(0, 20) + (title.length > 18 ? '...' : '');
	}

	let backgroundColor = setBackgroundColor(props.priority, props.completionStatus, props.dueDate);
	let strikeThrough = setStatus(props.completionStatus);
	let displayDate = setDisplay(props.completionStatus);
	let displayTitle = parseTitle(props.title);

	const styles = StyleSheet.create({
		boxDiv: {
			flex: 1,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			minHeight: 30,
			backgroundColor: backgroundColor,
			marginTop: 5,
			borderRadius: 5,
			paddingLeft: 10,
			paddingRight: 10,
			maxHeight: 30
		},
		title: {
			fontWeight: '500',
			fontSize: 15,
			color: 'white',
			textDecorationLine: strikeThrough,
			flex: 1,
			maxWidth: 175
		},
		timeDiv: {
			flexDirection: 'row',
			display: displayDate
		},
		date: {
			fontWeight: '400',
			fontSize: 14,
			color: 'white',
			paddingLeft: 4
		}
	});

	return (
		<View style={styles.boxDiv}>
			<Text style={styles.title}>{displayTitle}</Text>
			<View style={styles.timeDiv}>
				<FeatherIcon name="clock" color='white' />
				<Text style={styles.date}>{parseDate(props.dueDate)}</Text>
			</View>
		</View>
	)
}

export default TaskBox;