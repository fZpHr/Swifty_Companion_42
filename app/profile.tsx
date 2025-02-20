import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Avatar, Text, List, IconButton, FAB } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
	const loadUserData = async () => {
		try {
		const userData = await AsyncStorage.getItem('userData');
		if (userData) {
			setUser(JSON.parse(userData));
		}
		} catch (error) {
		// console.error('Erreur lors du chargement des données:', error);
		}
	};
	loadUserData();
	}, []);

	if (!user) return null;

	return (
	<View style={{ flex: 1 }}>
		<ScrollView style={{ padding: 10 }}>
			{/* Image de profil et nom */}
			<Card style={{ marginBottom: 10}}>
				<Card.Title style={{ padding: 10 }}
					title={user.login}
					subtitle={user.displayname}
					left={props =>  <Avatar.Image {...props} source={{ uri: user.image.link }} />}
				/>
			</Card>

			<List.Section>
			{/* Informations de Base */}
			<List.Accordion
				title="Informations de Base"
				left={props => <List.Icon {...props} icon="account" />}>
				<List.Item title="ID" description={user.id} />
				<List.Item title="Email" description={user.email} />
				<List.Item title="Nom complet" description={user.usual_full_name} />
				<List.Item title="Location" description={user.location || "Absent"} />
				<List.Item title="Téléphone" description={user.phone} />
			</List.Accordion>

			{/* Status */}
			<List.Accordion
				title="Status"
				left={props => <List.Icon {...props} icon="star" />}>
				<List.Item title="Type" description={user.kind} />
				<List.Item title="Actif" description={user["active?"] ? "Oui" : "Non"} />
				<List.Item title="Alumni" description={user["alumni?"] ? "Oui" : "Non"} />
			</List.Accordion>

			{/* Cursus */}
			<List.Accordion
			title="Cursus"
			left={props => <List.Icon {...props} icon="school" />}>
			{user.cursus_users.map((cursus: any, index: any) => (
				<List.Accordion
				key={cursus.id}
				title={index === 0 ? "Piscine" : "Cursus 42"}
				description={`Level: ${cursus.level}`}
				style={{ paddingLeft: 10 }}>
				{/* Skills */}
				{cursus.skills && cursus.skills.map((skill: any) => (
					<List.Item
					key={skill.id}
					title={skill.name}
					description={`Level: ${skill.level.toFixed(2)}`}
					style={{ paddingLeft: 30 }}
					/>
					))}
				</List.Accordion>
			))}
			</List.Accordion>
			
			{/* Projets */}
			<List.Accordion
			title={`Projets (${user.projects_users.length})`}
			left={props => <List.Icon {...props} icon="folder" />}>
			{user.projects_users
				.sort((a: any, b: any) => new Date(b.marked_at || 0).getTime() - new Date(a.marked_at || 0).getTime())
				.map((project: any) => (
					<List.Accordion
				key={project.id}
				title={`${project.project.name} ${project.final_mark ? `- ${project.final_mark}%` : ''}`}
				style={{ paddingLeft: 10 }}
				left={props => (
				<List.Icon
				{...props}
				icon={
					project.status === "in_progress" 
					? "progress-clock" 
					: project["validated?"] 
						? "check-circle" 
						: "close-circle"
					}
				color={
					project.status === "in_progress"
					? "#2196F3"
					: project["validated?"]
					? "#4CAF50"
					: "#F44336"
				}
				/>
				)}>
				<List.Item
				title="Status"
				description={
					project.status === "in_progress"
					? "En cours"
					: project["validated?"]
						? "Réussi"
						: "Échoué"
					}
				style={{ paddingLeft: 20 }}
				/>
				<List.Item
					title="Note"
					description={project.final_mark || '0'}
					style={{ paddingLeft: 20 }}
				/>
				<List.Item
					title="Tentative"
					description={`${project.occurrence + 1}`}
					style={{ paddingLeft: 20 }}
				/>
				{project.marked_at && (
					<List.Item
					title="Date"
					description={new Date(project.marked_at).toLocaleDateString()}
					style={{ paddingLeft: 20 }}
					/>
				)}
				</List.Accordion>
			))}
			</List.Accordion>

			{/* Achievements */}
			<List.Accordion
				title={`Achievements (${user.achievements.length})`}
				left={props => <List.Icon {...props} icon="trophy" />}>
				{user.achievements.map((achievement: any) => (
					<List.Item
					key={achievement.id}
					title={achievement.name}
					description={achievement.description}
					/>
					))}
			</List.Accordion>

			{/* Expertises */}
			<List.Accordion
			title={`Expertises (${user.expertises_users.length})`}
			left={props => <List.Icon {...props} icon="lightbulb" />}>
			{user.expertises_users.map((expertise: any) => {
				const expertiseDetails = [
					{id: 79, name: "Bootstrap"},
					{id: 78, name: "Euskera"},
					{id: 77, name: "Microsoft 365 Fundamentals"},
					{id: 76, name: "Microsoft Azure Fundamentals"},
					{id: 75, name: "Microsoft Power Platform Fundamentals"},
					{id: 74, name: "Microsoft Azure AI Fundamentals"},
					{id: 73, name: "Neo4j"},
					{id: 72, name: "VueJs"},
					{id: 71, name: "GCP"},
					{id: 70, name: "Unix"},
					{id: 69, name: "Kotlin"},
					{id: 68, name: "R"},
					{id: 67, name: "TypeScript"},
					{id: 66, name: "Angular"},
					{id: 65, name: "ASM"},
					{id: 64, name: "Basic"},
					{id: 63, name: "Cobol"},
					{id: 62, name: "Objective-C"},
					{id: 61, name: "Lua"},
					{id: 60, name: "Unity"},
					{id: 59, name: "Ocaml"},
					{id: 58, name: "Django"},
					{id: 57, name: "HyperV"},
					{id: 56, name: "Exchange"},
					{id: 55, name: "Active Directory"},
					{id: 54, name: "Windows Server 20xx"},
					{id: 53, name: "Puppet"},
					{id: 52, name: "Ansible"},
					{id: 51, name: "LDAP"},
					{id: 50, name: "Joomla"},
					{id: 49, name: "Phalcon"},
					{id: 48, name: "Ember.js"},
					{id: 47, name: "React"},
					{id: 46, name: "Prestashop"},
					{id: 45, name: "Photoshop"},
					{id: 44, name: "Cryptography"},
					{id: 43, name: "Elasticsearch"},
					{id: 42, name: "jQuery"},
					{id: 41, name: "iOS"},
					{id: 40, name: "CPP"},
					{id: 39, name: "Wordpress"},
					{id: 38, name: "Symfony"},
					{id: 37, name: "Swift"},
					{id: 36, name: "Shell"},
					{id: 35, name: "Scala"},
					{id: 34, name: "Rust"},
					{id: 33, name: "Ruby"},
					{id: 32, name: "Redis"},
					{id: 31, name: "Ruby on Rails"},
					{id: 30, name: "Python"},
					{id: 29, name: "PostgreSQL"},
					{id: 28, name: "Perl"},
					{id: 27, name: "PHP"},
					{id: 26, name: "Node.js"},
					{id: 25, name: "Nginx"},
					{id: 24, name: "MySQL"},
					{id: 23, name: "MongoDB"},
					{id: 22, name: "Meteor"},
					{id: 21, name: "MSSQL"},
					{id: 20, name: "Laravel"},
					{id: 19, name: "JavaScript"},
					{id: 18, name: "Java"},
					{id: 17, name: "Haskell"},
					{id: 16, name: "HTML"},
					{id: 15, name: "Go"},
					{id: 14, name: "Erlang"},
					{id: 13, name: "Elixir"},
					{id: 12, name: "Docker"},
					{id: 10, name: "Clojure"},
					{id: 9, name: "Cassandra"},
					{id: 8, name: "CSS"},
					{id: 7, name: "C#"},
					{id: 6, name: "C"},
					{id: 5, name: "Apache"},
					{id: 4, name: "AngularJS"},
					{id: 3, name: "Android"},
					{id: 2, name: "AWS"},
					{id: 1, name: ".NET"}
			];
			const expertiseDetail = expertiseDetails.find(exp => exp.id === expertise.expertise_id);
			return (
				<List.Item
				key={expertise.id}
				title={expertiseDetail ? expertiseDetail.name : `Expertise ${expertise.expertise_id}`}
				description={`Intéressé: ${expertise.interested ? "Oui" : "Non"}\nDate: ${new Date(expertise.created_at).toLocaleDateString()}`}
				/>
				);
			})}
			</List.Accordion>

			{/* Stats */}
			<List.Accordion
				title="Statistiques"
				left={props => <List.Icon {...props} icon="chart-bar" />}
			>
				<List.Item title="Points de correction" description={user.correction_point} />
				<List.Item title="Wallet" description={user.wallet} />
				<List.Item title="Titres" description={user.titles.length} />
				<List.Item 
				title="Créé le"
				description={new Date(user.created_at).toLocaleDateString()} 
				/>
				<List.Item 
				title="Mis à jour le" 
				description={new Date(user.updated_at).toLocaleDateString()} 
				/>
			</List.Accordion>
			</List.Section>
		</ScrollView>
	<FAB
	icon="arrow-left"
	style={{
		position: 'absolute',
		margin: 15,
		right: 0,
		bottom: 0,
		backgroundColor: 'white',
	}}
	onPress={() => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push("/");
		}
	}}
	/>
	</View>
	);
}