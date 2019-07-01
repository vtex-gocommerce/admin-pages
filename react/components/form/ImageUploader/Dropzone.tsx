import React, { ReactElement } from 'react'
import ReactDropzone, { DropzoneOptions } from 'react-dropzone'

interface Props {
  children: ReactElement<any>
  disabled: boolean
  extraClasses?: string
  onClick: React.MouseEventHandler<HTMLElement>
  onDrop: DropzoneOptions['onDrop']
}

const MAX_SIZE = 4 * 1024 * 1024

const Dropzone: React.FunctionComponent<Props> = ({
  disabled,
  children,
  extraClasses,
  onClick,
  onDrop,
}) => (
  <ReactDropzone
    accept="image/*"
    disabled={disabled}
    maxSize={MAX_SIZE}
    multiple={false}
    onDrop={onDrop}
  >
    {({ getRootProps, getInputProps }) => (
      <div
        {...getRootProps({ onClick: e => onClick(e) })}
        className={`w-100 h4 br2 ${extraClasses}`}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    )}
  </ReactDropzone>
)

Dropzone.defaultProps = {
  extraClasses: '',
}

export default Dropzone
