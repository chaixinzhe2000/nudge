import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Moment from "moment";
import { Feather } from '@expo/vector-icons';
import moment from "moment";

function FeatherIcon(props: { name: React.ComponentProps<typeof Feather>['name']; color: string }) {
	return <Feather size={14} style={{ marginTop: 1 }} {...props} />;
}

interface ITaskBoxProps {
	priority: String,
	title: String,
	dueDate: any
}

function TaskBox(props: ITaskBoxProps) {
	const setBackgroundColor = (pLevel: String) => {
		if (pLevel === 'high') {
			return '#f58822';
		} else if (pLevel === 'medium' || pLevel ==='low') {
			return '#2cb9b0';
		} else {
			return '#7a7a7a';
		}
	};

	const setStatus = (pLevel: String) => {
		if (pLevel === 'completed') {
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
		console.log(time)
		if (calendar === 'Today') {
			return ('TDY ' + time);
		} else if (calendar === 'Tomorrow') {
			return ('TMR ' + time);
		} else {
			return (uDate);
		}
	}

	const setDisplay = (pLevel: String) => {
		if (pLevel === 'completed') {
			return 'none';
		} else {
			return 'flex';
		}
	}

	let backgroundColor = setBackgroundColor(props.priority);
	let strikeThrough = setStatus(props.priority);
	let displayDate = setDisplay(props.priority);

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
			textDecorationLine: strikeThrough
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
		},
		box: {
			
		}
	});

	return (
		<View style={styles.boxDiv}>
			{console.log(props.dueDate)}
			<Text style={styles.title}>{props.title}</Text>
			<View style={styles.timeDiv}>
				<FeatherIcon name="clock" color='white' />
				<Text style={styles.date}>{parseDate(props.dueDate)}</Text>
			</View>
		</View>
	)
}

export default TaskBox;