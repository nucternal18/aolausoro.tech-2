import React from 'react'

const ToggleControlButton = ({
  value,
  onChange,
}: {
  value: boolean
  onChange: (...event: any[]) => void
}) => {
  return (
    <div className="m-2 mb-6 flex cursor-pointer items-center">
      <label htmlFor="toggle-example-checked" className="relative flex cursor-pointer items-center">
        <input type="checkbox" id="toggle-example-checked" className="sr-only" checked={value} />
        <div
          onClick={() => onChange(!value)}
          className={`toggle-bg ${
            value ? 'border-green-500 bg-green-500' : 'border-red-500 bg-red-500'
          } h-6 w-11 rounded-full border-2`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white ${
              value ? 'translate-x-2' : '-translate-x-2'
            } mx-auto transform duration-300 ease-in-out`}
          ></div>
        </div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-100">Published</span>
      </label>
    </div>
  )
}

export default ToggleControlButton
