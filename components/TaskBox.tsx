import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface ITaskBoxProps {
	priority: String,
	title: String,
	dueDate: Date
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

	let backgroundColor = setBackgroundColor(props.priority);
	let strikeThrough = setStatus(props.priority);

	const styles = StyleSheet.create({
		boxDiv: {
			display: 'flex',
			justifyContent: 'center',
			height: 30,
			width: 287,
			backgroundColor: backgroundColor,
			marginTop: 5,
			borderRadius: 5
		},
		title: {
			fontWeight: '600',
			fontSize: 15,
			color: 'white',
			paddingLeft: 10,
			paddingTop: 12.5,
			textDecorationLine: strikeThrough
		},
		date: {
			fontWeight: '600',
			fontSize: 15,
			color: 'white'
		}
	});

	return (
		<View style={styles.boxDiv}>
			<Text style={styles.title}>{props.title}</Text>
			<Text style={styles.date}>{props.dueDate.toUTCString()}</Text>
		</View>
 
	)
}

export default TaskBox;