import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Moment from "moment";

interface ITaskBoxProps {
	priority: String,
	title: String,
	dueDate: any
}

function TaskBox(props: ITaskBoxProps) {
	const setBackgroundColor = (pLevel: String) => {
		if (pLevel === 'high') {
			return '#f58822';
		} else if (pLevel === 'normal') {
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
		const date = m.format('MMM D');
		const uDate = date.toUpperCase();
		const time = m.format('h:mm A');

		return (uDate + ' @ ' + time);
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
	let date = parseDate(props.dueDate);
	let displayDate = setDisplay(props.priority);

	const styles = StyleSheet.create({
		boxDiv: {
			flex: 1,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			width: 295,
			minHeight: 30,
			backgroundColor: backgroundColor,
			marginTop: 5,
			borderRadius: 5,
			paddingLeft: 10,
			paddingRight: 10
		},
		title: {
			fontWeight: '500',
			fontSize: 15,
			color: 'white',
			textDecorationLine: strikeThrough
		},
		date: {
			fontWeight: '400',
			fontSize: 15,
			color: 'white',
			display: displayDate
		}
	});

	return (
		<View style={styles.boxDiv}>
			<Text style={styles.title}>{props.title}</Text>
			<Text style={styles.date}>{date}</Text>
		</View>
 
	)
}

export default TaskBox;