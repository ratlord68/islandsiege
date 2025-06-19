import React from 'react'

interface Color {
  name: string
  value: string
}

interface ColorPickerProps {
  allColors: Color[]
  disabledColors?: string[]
  selectedColor: string
  onSelect: (color: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  allColors,
  disabledColors = [],
  selectedColor,
  onSelect,
}) => (
  <div
    style={{
      display: 'flex',
      gap: 12,
      margin: '12px 0',
      alignItems: 'center',
    }}>
    {allColors.map(color => {
      const isDisabled =
        disabledColors.includes(color.value) && color.value !== selectedColor
      return (
        <div
          key={color.value}
          onClick={() => !isDisabled && onSelect(color.value)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: color.value,
            border:
              selectedColor === color.value
                ? '3px solid #222'
                : '2px solid #ccc',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.3 : 1,
            boxShadow:
              selectedColor === color.value ? '0 0 6px #222' : undefined,
            transition: 'opacity 0.2s',
          }}
          title={color.name}
        />
      )
    })}
  </div>
)

export default ColorPicker
