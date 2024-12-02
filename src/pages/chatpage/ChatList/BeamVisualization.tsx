"use client";

import React, { useRef, useEffect, useState } from "react";
import { AnimatedBeam } from "./AnimatedBeam";
import { cn } from "@/util/twmerge";
import { IonIcon } from "@ionic/react";
import {
	chatbubbleEllipsesOutline,
	personCircleOutline,
	personOutline
} from "ionicons/icons";

interface BeamVisualizationProps {
	uuidCount: number; // Number of participants (UUIDs)
}

export const BeamVisualization: React.FC<BeamVisualizationProps> = ({ uuidCount }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const centralRef = useRef<HTMLDivElement>(null); // Central chat room div
	const creatorRef = useRef<HTMLDivElement>(null); // Creator div

	// Dynamically create refs for participants
	const [participantRefs, setParticipantRefs] = useState<
		React.RefObject<HTMLDivElement>[]
	>([]);

	useEffect(() => {
		// Update participant refs when uuidCount changes
		const refs = Array.from({ length: uuidCount }, () =>
			React.createRef<HTMLDivElement>()
		);
		setParticipantRefs(refs);
	}, [uuidCount]);

	return (
		<div
			className={cn("relative flex h-[500px] w-full items-center justify-around pb-24")}
			ref={containerRef}>
			{/* Creator (left div) */}
			<div
				ref={creatorRef}
				className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-backgroundHighlight text-white shadow-lg">
				<IonIcon icon={personCircleOutline} className="text-4xl" />
			</div>

			{/* Central Chat Room */}
			<div
				ref={centralRef}
				className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg">
				<IonIcon icon={chatbubbleEllipsesOutline} className="text-4xl" />
			</div>

			{/* Participants (right divs) */}
			<div className="flex flex-col gap-4">
				{participantRefs.map((ref, index) => (
					<div
						key={index}
						ref={ref}
						className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-backgroundHighlight text-white shadow-lg">
						<IonIcon icon={personOutline} className="text-2xl text-primary-light" />
					</div>
				))}
			</div>

			{/* Beams */}
			{/* From Creator to Central */}
			<AnimatedBeam containerRef={containerRef} fromRef={creatorRef} toRef={centralRef} />

			{/* From Central to Each Participant */}
			{participantRefs.map((ref, index) => (
				<AnimatedBeam
					key={index}
					containerRef={containerRef}
					fromRef={centralRef}
					toRef={ref}
				/>
			))}
		</div>
	);
};

export default BeamVisualization;
