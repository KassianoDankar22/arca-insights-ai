/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React from 'react';
import { Button } from "./ui/button";

interface TomROIBotaoProps {
	onClick: () => void;
	label: string;
}

const TomROIBotao: React.FC<TomROIBotaoProps> = ({ onClick, label }) => {
	return (
		<Button
			onClick={onClick}
			className="bg-arca-main text-white font-bold py-2 px-4 rounded hover:bg-arca-dark transition-colors duration-300"
		>
			{label}
		</Button>
	);
};

export default TomROIBotao;
