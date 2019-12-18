import { Component, forwardRef, Input, OnInit } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { ServerService } from '@app/core'
import { ServerConfig } from '@shared/models'

@Component({
  selector: 'my-preview-upload',
  styleUrls: [ './preview-upload.component.scss' ],
  templateUrl: './preview-upload.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreviewUploadComponent),
      multi: true
    }
  ]
})
export class PreviewUploadComponent implements OnInit, ControlValueAccessor {
  @Input() inputLabel: string
  @Input() inputName: string
  @Input() previewWidth: string
  @Input() previewHeight: string

  imageSrc: SafeResourceUrl
  allowedExtensionsMessage = ''

  private serverConfig: ServerConfig
  private file: File

  constructor (
    private sanitizer: DomSanitizer,
    private serverService: ServerService
  ) {}

  get videoImageExtensions () {
    return this.serverConfig.video.image.extensions
  }

  get maxVideoImageSize () {
    return this.serverConfig.video.image.size.max
  }

  ngOnInit () {
    this.serverConfig = this.serverService.getTmpConfig()
    this.serverService.getConfig()
      .subscribe(config => this.serverConfig = config)

    this.allowedExtensionsMessage = this.videoImageExtensions.join(', ')
  }

  onFileChanged (file: File) {
    this.file = file

    this.propagateChange(this.file)
    this.updatePreview()
  }

  propagateChange = (_: any) => { /* empty */ }

  writeValue (file: any) {
    this.file = file
    this.updatePreview()
  }

  registerOnChange (fn: (_: any) => void) {
    this.propagateChange = fn
  }

  registerOnTouched () {
    // Unused
  }

  private updatePreview () {
    if (this.file) {
      const url = URL.createObjectURL(this.file)
      this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url)
    }
  }
}
