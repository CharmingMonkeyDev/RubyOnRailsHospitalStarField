import React from "react";

interface props {
    count: string|number
}

const CountBadge: React.FC<props> = ({count}) => {
    return (
        <div style={{
            display: 'flex',
            width: '23px',
            height: '16px',
            flexDirection: 'column',
            justifyContent: 'center',
            flexShrink: '0',
            borderRadius: '80px',
            background: '#EFE9E7'
        }}>
            <p style={{
                color: '#1E1E1E',
                textAlign: 'center',
                // fontFamily: 'Quicksand',
                fontSize: '8px',
                fontStyle: 'normal',
                fontWeight: '600',
                lineHeight: '16px'
            }}>
                {count}
            </p>
        </div>
    )
}

export default CountBadge;