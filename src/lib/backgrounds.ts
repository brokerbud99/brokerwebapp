export type BackgroundPatternId =
    | 'blobs'
    | 'grid'
    | 'dots'
    | 'waveform'
    | 'gradient-mesh'
    | 'hexagons'
    | 'circuit'
    | 'topography'
    | 'stripes'
    | 'minimalist'
    | 'particles'
    | 'waves'
    | 'geometric'
    | 'mesh-gradient'
    | 'radial-lines'
    | 'cross-hatch'
    | 'noise'
    | 'bokeh'
    | 'zigzag'
    | 'constellation';

export interface BackgroundPattern {
    id: BackgroundPatternId;
    name: string;
    description: string;
}

export const backgroundPatterns: BackgroundPattern[] = [
    {
        id: 'blobs',
        name: 'Animated Blobs',
        description: 'Organic, flowing shapes (Original)',
    },
    {
        id: 'grid',
        name: 'Subtle Grid',
        description: 'Clean, technical grid pattern',
    },
    {
        id: 'dots',
        name: 'Dot Matrix',
        description: 'Minimalist dot pattern',
    },
    {
        id: 'waveform',
        name: 'Waveform',
        description: 'Flowing sine waves',
    },
    {
        id: 'gradient-mesh',
        name: 'Gradient Mesh',
        description: 'Soft, blended color gradients',
    },
    {
        id: 'hexagons',
        name: 'Hexagons',
        description: 'Geometric honeycomb structure',
    },
    {
        id: 'circuit',
        name: 'Circuit Board',
        description: 'High-tech electronic traces',
    },
    {
        id: 'topography',
        name: 'Topography',
        description: 'Map-like contour lines',
    },
    {
        id: 'stripes',
        name: 'Diagonal Stripes',
        description: 'Dynamic angled lines',
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Solid background color only',
    },
    {
        id: 'particles',
        name: 'Particles',
        description: 'Floating particle effect',
    },
    {
        id: 'waves',
        name: 'Waves',
        description: 'Smooth wave patterns',
    },
    {
        id: 'geometric',
        name: 'Geometric',
        description: 'Modern geometric shapes',
    },
    {
        id: 'mesh-gradient',
        name: 'Mesh Gradient',
        description: 'Colorful gradient mesh',
    },
    {
        id: 'radial-lines',
        name: 'Radial Lines',
        description: 'Radiating line pattern',
    },
    {
        id: 'cross-hatch',
        name: 'Cross Hatch',
        description: 'Artistic cross-hatch lines',
    },
    {
        id: 'noise',
        name: 'Noise Texture',
        description: 'Subtle grain texture',
    },
    {
        id: 'bokeh',
        name: 'Bokeh',
        description: 'Soft bokeh light circles',
    },
    {
        id: 'zigzag',
        name: 'Zigzag',
        description: 'Dynamic zigzag pattern',
    },
    {
        id: 'constellation',
        name: 'Constellation',
        description: 'Connected dots like stars',
    },
];
